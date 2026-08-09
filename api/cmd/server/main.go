package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"patrickfanella.co/api/internal/config"
	"patrickfanella.co/api/internal/handlers"
	"patrickfanella.co/api/internal/models"
	"patrickfanella.co/api/internal/notifications"
	"patrickfanella.co/api/internal/store"
)

func main() {
	cfg := config.Load()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))

	appStore, err := store.New(context.Background(), cfg.DatabaseURL, store.ConnectConfig{
		MaxAttempts: 10,
		InitialWait: 500 * time.Millisecond,
		MaxWait:     10 * time.Second,
	})
	appStore.SetLogger(logger)
	if err != nil {
		logger.Warn("database unavailable, starting in degraded mode", slog.Any("error", err))
	}
	defer appStore.Close()

	pruneContacts := func() {
		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()
		cutoff := time.Now().UTC().AddDate(0, 0, -cfg.ContactRetentionDays)
		deleted, err := appStore.PruneContacts(ctx, cutoff)
		if err != nil {
			if !errors.Is(err, models.ErrDatabaseUnavailable) {
				logger.Error("contact retention prune failed", slog.Any("error", err))
			}
			return
		}
		logger.Info("contact retention prune complete", slog.Int64("deleted_count", deleted), slog.Int("retention_days", cfg.ContactRetentionDays))
	}
	pruneContacts()
	go func() {
		ticker := time.NewTicker(24 * time.Hour)
		defer ticker.Stop()
		for range ticker.C {
			pruneContacts()
		}
	}()

	// Background goroutine: periodically check DB health and reconnect if needed.
	go func() {
		ticker := time.NewTicker(15 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			if appStore.DatabaseEnabled() {
				continue
			}
			ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
			if err := appStore.TryReconnect(ctx); err != nil {
				logger.Warn("background reconnect failed", slog.Any("error", err))
			} else {
				logger.Info("database connection restored")
			}
			cancel()
		}
	}()

	api := handlers.New(appStore, handlers.ContactSecurityConfig{
		AllowedOrigin:        cfg.CORSOrigin,
		HoneypotField:        cfg.ContactHoneypotField,
		MaxBodyBytes:         cfg.ContactMaxBodyBytes,
		RateLimitMaxRequests: cfg.ContactRateLimitMax,
		RateLimitWindow:      cfg.ContactRateLimitWindow,
	})
	api.SetLogger(logger)
	api.SetNotifier(notifications.NewMultiNotifier(
		cfg.ContactNotificationNtfyURL,
		cfg.ContactNotificationNtfyToken,
		cfg.ContactNotificationN8nURL,
		cfg.ContactNotificationTimeout,
	))

	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(api.Observability)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/api/health", api.Health)
	r.Get("/api/projects", api.ListProjects)
	r.Get("/api/projects/{slug}", api.GetProject)
	r.Post("/api/contact", api.CreateContact)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
	}

	logger.Info("api listening", slog.String("addr", ":"+cfg.Port), slog.Bool("database_enabled", appStore.DatabaseEnabled()), slog.Bool("notifications_enabled", api.NotificationsEnabled()))
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		logger.Error("server exited unexpectedly", slog.Any("error", err))
		os.Exit(1)
	}
}

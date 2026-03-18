package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"patrickfanella.co/api/internal/config"
	"patrickfanella.co/api/internal/handlers"
	"patrickfanella.co/api/internal/notifications"
	"patrickfanella.co/api/internal/store"
)

func main() {
	cfg := config.Load()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	appStore, err := store.New(ctx, cfg.DatabaseURL)
	if err != nil {
		logger.Warn("database unavailable, starting in degraded mode", slog.Any("error", err))
	}
	defer appStore.Close()

	api := handlers.New(appStore, handlers.ContactSecurityConfig{
		AllowedOrigin:        cfg.CORSOrigin,
		HoneypotField:        cfg.ContactHoneypotField,
		MaxBodyBytes:         cfg.ContactMaxBodyBytes,
		RateLimitMaxRequests: cfg.ContactRateLimitMax,
		RateLimitWindow:      cfg.ContactRateLimitWindow,
	})
	api.SetLogger(logger)
	api.SetNotifier(notifications.NewWebhookNotifier(
		cfg.ContactNotificationWebhookURL,
		cfg.ContactNotificationBearerToken,
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

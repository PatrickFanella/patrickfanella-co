package handlers

import (
	"context"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5/middleware"

	"patrickfanella.co/api/internal/models"
)

type ContactNotifier interface {
	NotifyContact(ctx context.Context, message models.ContactMessage) error
	Enabled() bool
}

type noopNotifier struct{}

func (noopNotifier) NotifyContact(context.Context, models.ContactMessage) error {
	return nil
}

func (noopNotifier) Enabled() bool {
	return false
}

func (api *API) Observability(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		wrapped := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

		next.ServeHTTP(wrapped, r)

		status := wrapped.Status()
		if status == 0 {
			status = http.StatusOK
		}

		api.requestCount.Add(1)
		if status >= http.StatusBadRequest {
			api.errorCount.Add(1)
		}

		api.loggerForRequest(r).Info(
			"http.request",
			slog.Int("status", status),
			slog.Int("bytes_written", wrapped.BytesWritten()),
			slog.Duration("duration", time.Since(started)),
			slog.String("client_ip", clientIPFromRequest(r)),
			slog.String("user_agent", strings.TrimSpace(r.UserAgent())),
		)
	})
}

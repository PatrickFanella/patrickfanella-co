package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/mail"
	"strings"
	"sync/atomic"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"patrickfanella.co/api/internal/models"
)

type Store interface {
	DatabaseEnabled() bool
	ListProjects(ctx context.Context) ([]models.Project, error)
	GetProject(ctx context.Context, slug string) (models.Project, error)
	SaveContact(ctx context.Context, input models.ContactInput) (models.ContactMessage, error)
}

type API struct {
	store           Store
	contactSecurity ContactSecurityConfig
	contactLimiter  *contactRateLimiter
	logger          *slog.Logger
	notifier        ContactNotifier
	startedAt       time.Time
	requestCount    atomic.Uint64
	errorCount      atomic.Uint64
	contactCount    atomic.Uint64
	notificationFailures atomic.Uint64
}

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
	Website string `json:"website,omitempty"`
}

func New(store Store, options ...ContactSecurityConfig) *API {
	security := defaultContactSecurityConfig()
	if len(options) > 0 {
		security = options[0].withDefaults()
	}

	return &API{
		store:           store,
		contactSecurity: security,
		contactLimiter:  newContactRateLimiter(security.RateLimitMaxRequests, security.RateLimitWindow),
		logger:          slog.New(slog.NewJSONHandler(io.Discard, nil)),
		notifier:        noopNotifier{},
		startedAt:       time.Now().UTC(),
	}
}

func (api *API) SetLogger(logger *slog.Logger) {
	if logger == nil {
		return
	}

	api.logger = logger
}

func (api *API) SetNotifier(notifier ContactNotifier) {
	if notifier == nil {
		api.notifier = noopNotifier{}
		return
	}

	api.notifier = notifier
}

func (api *API) NotificationsEnabled() bool {
	return api.notifier != nil && api.notifier.Enabled()
}

func (api *API) Health(w http.ResponseWriter, r *http.Request) {
	status := "ok"
	databaseStatus := "ok"
	if !api.store.DatabaseEnabled() {
		status = "degraded"
		databaseStatus = "unavailable"
	}

	now := time.Now().UTC()
	writeJSON(w, http.StatusOK, map[string]any{
		"status":                 status,
		"databaseEnabled":        api.store.DatabaseEnabled(),
		"databaseStatus":         databaseStatus,
		"notificationsEnabled":   api.NotificationsEnabled(),
		"startedAt":              api.startedAt,
		"uptimeSeconds":          int64(now.Sub(api.startedAt).Seconds()),
		"requestCount":           api.requestCount.Load(),
		"errorCount":             api.errorCount.Load(),
		"contactSubmissionCount": api.contactCount.Load(),
		"notificationFailureCount": api.notificationFailures.Load(),
		"requestId":              middleware.GetReqID(r.Context()),
		"timestamp":              now,
	})
}

func (api *API) ListProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := api.store.ListProjects(r.Context())
	if err != nil {
		api.loggerForRequest(r).Error("projects.list failed", slog.Any("error", err))
		writeStoreError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, models.ProjectListResponse{Items: projects})
}

func (api *API) GetProject(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	project, err := api.store.GetProject(r.Context(), slug)
	if err != nil {
		api.loggerForRequest(r).Error("projects.detail failed", slog.String("slug", slug), slog.Any("error", err))
		writeStoreError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, models.ProjectDetailResponse{Item: project})
}

func (api *API) CreateContact(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	clientIP := clientIPFromRequest(r)
	origin := strings.TrimSpace(r.Header.Get("Origin"))
	contentType := strings.TrimSpace(r.Header.Get("Content-Type"))

	if origin != "" && !sameOrigin(origin, api.contactSecurity.AllowedOrigin) {
		api.loggerForRequest(r).Warn("contact.create rejected", slog.String("reason", "origin_mismatch"), slog.String("origin", origin), slog.String("client_ip", clientIP))
		writeError(w, http.StatusForbidden, "forbidden_origin", "This origin is not allowed to submit the contact form.", nil)
		return
	}

	if !strings.HasPrefix(strings.ToLower(contentType), "application/json") {
		api.loggerForRequest(r).Warn("contact.create rejected", slog.String("reason", "unsupported_media_type"), slog.String("content_type", contentType), slog.String("client_ip", clientIP))
		writeError(w, http.StatusUnsupportedMediaType, "unsupported_media_type", "Contact submissions must be sent as JSON.", nil)
		return
	}

	if !api.contactLimiter.Allow(clientIP) {
		api.loggerForRequest(r).Warn("contact.create rejected", slog.String("reason", "rate_limit"), slog.String("client_ip", clientIP))
		writeError(w, http.StatusTooManyRequests, "rate_limited", "Too many contact attempts. Please wait a moment and try again.", nil)
		return
	}

	r.Body = http.MaxBytesReader(w, r.Body, api.contactSecurity.MaxBodyBytes)

	var request contactRequest
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&request); err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			api.loggerForRequest(r).Warn("contact.create rejected", slog.String("reason", "payload_too_large"), slog.String("client_ip", clientIP), slog.Int64("limit_bytes", api.contactSecurity.MaxBodyBytes))
			writeError(w, http.StatusRequestEntityTooLarge, "payload_too_large", "The contact request is too large.", nil)
			return
		}

		api.loggerForRequest(r).Warn("contact.create invalid_json", slog.Any("error", err), slog.String("client_ip", clientIP))
		writeError(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.", nil)
		return
	}

	var extra json.RawMessage
	if err := decoder.Decode(&extra); err != io.EOF {
		api.loggerForRequest(r).Warn("contact.create invalid_json", slog.String("reason", "multiple_json_values"), slog.String("client_ip", clientIP))
		writeError(w, http.StatusBadRequest, "invalid_json", "Request body must contain a single JSON object.", nil)
		return
	}

	request.Name = strings.TrimSpace(request.Name)
	request.Email = strings.TrimSpace(request.Email)
	request.Message = strings.TrimSpace(request.Message)
	request.Website = strings.TrimSpace(request.Website)

	if request.Website != "" {
		api.loggerForRequest(r).Warn("contact.create suppressed", slog.String("reason", "honeypot"), slog.String("client_ip", clientIP), slog.String("field", api.contactSecurity.HoneypotField))
		writeJSON(w, http.StatusAccepted, models.ContactSubmissionResponse{
			Message: "Thanks — your note has been saved.",
			Item: models.ContactMessage{
				Name:    request.Name,
				Email:   request.Email,
				Message: request.Message,
			},
		})
		return
	}

	input := models.ContactInput{
		Name:    request.Name,
		Email:   request.Email,
		Message: request.Message,
	}

	if fields := validateContactInput(input); len(fields) > 0 {
		api.loggerForRequest(r).Warn("contact.create validation_failed", slog.Any("fields", fields), slog.String("client_ip", clientIP))
		writeError(w, http.StatusBadRequest, "validation_error", "Please correct the highlighted fields.", fields)
		return
	}

	message, err := api.store.SaveContact(r.Context(), input)
	if err != nil {
		switch {
		case errors.Is(err, models.ErrDatabaseUnavailable):
			api.loggerForRequest(r).Error("contact.create database_unavailable", slog.String("client_ip", clientIP))
			writeError(w, http.StatusServiceUnavailable, "database_unavailable", "Contact submissions are temporarily unavailable.", nil)
		default:
			api.loggerForRequest(r).Error("contact.create persistence_error", slog.Any("error", err), slog.String("client_ip", clientIP))
			writeError(w, http.StatusInternalServerError, "internal_error", "Unable to store message.", nil)
		}
		return
	}

	api.contactCount.Add(1)
	if api.NotificationsEnabled() {
		if err := api.notifier.NotifyContact(r.Context(), message); err != nil {
			api.notificationFailures.Add(1)
			api.loggerForRequest(r).Error("contact.create notification_failed", slog.Int64("contact_id", message.ID), slog.Any("error", err))
		} else {
			api.loggerForRequest(r).Info("contact.create notification_sent", slog.Int64("contact_id", message.ID))
		}
	}

	api.loggerForRequest(r).Info("contact.create stored", slog.Int64("contact_id", message.ID))

	writeJSON(w, http.StatusCreated, models.ContactSubmissionResponse{
		Message: "Thanks — your note has been saved.",
		Item:    message,
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeStoreError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, models.ErrProjectNotFound):
		writeError(w, http.StatusNotFound, "project_not_found", "Project not found.", nil)
	case errors.Is(err, models.ErrDatabaseUnavailable):
		writeError(w, http.StatusServiceUnavailable, "database_unavailable", "Portfolio data is temporarily unavailable.", nil)
	default:
		writeError(w, http.StatusInternalServerError, "internal_error", "Unable to load portfolio data.", nil)
	}
}

func writeError(w http.ResponseWriter, status int, code, message string, fields map[string]string) {
	writeJSON(w, status, models.ErrorResponse{
		Error: models.APIError{
			Code:    code,
			Message: message,
			Fields:  fields,
		},
	})
}

func validateContactInput(input models.ContactInput) map[string]string {
	fields := map[string]string{}

	if len(input.Name) < 2 {
		fields["name"] = "Please enter your name."
	}

	if _, err := mail.ParseAddress(input.Email); err != nil {
		fields["email"] = "Please enter a valid email address."
	}

	if len(input.Message) < 20 {
		fields["message"] = "A little more detail helps — aim for at least 20 characters."
	}

	if len(fields) == 0 {
		return nil
	}

	return fields
}

func (api *API) loggerForRequest(r *http.Request) *slog.Logger {
	logger := api.logger
	if logger == nil {
		return slog.New(slog.NewJSONHandler(io.Discard, nil))
	}

	return logger.With(
		slog.String("request_id", middleware.GetReqID(r.Context())),
		slog.String("method", r.Method),
		slog.String("path", r.URL.Path),
	)
}

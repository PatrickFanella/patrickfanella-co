package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

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
	}
}

func (api *API) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{
		"status":          "ok",
		"databaseEnabled": api.store.DatabaseEnabled(),
		"timestamp":       time.Now().UTC(),
	})
}

func (api *API) ListProjects(w http.ResponseWriter, r *http.Request) {
	projects, err := api.store.ListProjects(r.Context())
	if err != nil {
		log.Printf("projects.list error=%v", err)
		writeStoreError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, models.ProjectListResponse{Items: projects})
}

func (api *API) GetProject(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	project, err := api.store.GetProject(r.Context(), slug)
	if err != nil {
		log.Printf("projects.detail slug=%q error=%v", slug, err)
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
		log.Printf("contact.create rejected reason=origin_mismatch origin=%q remote=%s", origin, clientIP)
		writeError(w, http.StatusForbidden, "forbidden_origin", "This origin is not allowed to submit the contact form.", nil)
		return
	}

	if !strings.HasPrefix(strings.ToLower(contentType), "application/json") {
		log.Printf("contact.create rejected reason=unsupported_media_type content_type=%q remote=%s", contentType, clientIP)
		writeError(w, http.StatusUnsupportedMediaType, "unsupported_media_type", "Contact submissions must be sent as JSON.", nil)
		return
	}

	if !api.contactLimiter.Allow(clientIP) {
		log.Printf("contact.create rejected reason=rate_limit remote=%s", clientIP)
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
			log.Printf("contact.create rejected reason=payload_too_large remote=%s limit=%d", clientIP, api.contactSecurity.MaxBodyBytes)
			writeError(w, http.StatusRequestEntityTooLarge, "payload_too_large", "The contact request is too large.", nil)
			return
		}

		log.Printf("contact.create invalid_json error=%v", err)
		writeError(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.", nil)
		return
	}

	var extra json.RawMessage
	if err := decoder.Decode(&extra); err != io.EOF {
		log.Printf("contact.create invalid_json error=multiple_json_values")
		writeError(w, http.StatusBadRequest, "invalid_json", "Request body must contain a single JSON object.", nil)
		return
	}

	request.Name = strings.TrimSpace(request.Name)
	request.Email = strings.TrimSpace(request.Email)
	request.Message = strings.TrimSpace(request.Message)
	request.Website = strings.TrimSpace(request.Website)

	if request.Website != "" {
		log.Printf("contact.create suppressed reason=honeypot remote=%s field=%q", clientIP, api.contactSecurity.HoneypotField)
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
		log.Printf("contact.create validation_failed fields=%v", fields)
		writeError(w, http.StatusBadRequest, "validation_error", "Please correct the highlighted fields.", fields)
		return
	}

	message, err := api.store.SaveContact(r.Context(), input)
	if err != nil {
		switch {
		case errors.Is(err, models.ErrDatabaseUnavailable):
			log.Printf("contact.create database_unavailable")
			writeError(w, http.StatusServiceUnavailable, "database_unavailable", "Contact submissions are temporarily unavailable.", nil)
		default:
			log.Printf("contact.create persistence_error error=%v", err)
			writeError(w, http.StatusInternalServerError, "internal_error", "Unable to store message.", nil)
		}
		return
	}

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

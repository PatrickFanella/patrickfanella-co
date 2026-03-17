package handlers

import (
	"context"
	"encoding/json"
	"errors"
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
	store Store
}

func New(store Store) *API {
	return &API{store: store}
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

	var input models.ContactInput
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		log.Printf("contact.create invalid_json error=%v", err)
		writeError(w, http.StatusBadRequest, "invalid_json", "Request body must be valid JSON.", nil)
		return
	}

	if decoder.More() {
		log.Printf("contact.create invalid_json error=multiple_json_values")
		writeError(w, http.StatusBadRequest, "invalid_json", "Request body must contain a single JSON object.", nil)
		return
	}

	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.TrimSpace(input.Email)
	input.Message = strings.TrimSpace(input.Message)

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

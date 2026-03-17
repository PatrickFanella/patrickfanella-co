package handlers

import (
	"encoding/json"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"

	"patrickfanella.co/api/internal/models"
	"patrickfanella.co/api/internal/store"
)

type API struct {
	store *store.Store
}

func New(store *store.Store) *API {
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
	writeJSON(w, http.StatusOK, map[string]any{
		"items": api.store.ListProjects(),
	})
}

func (api *API) GetProject(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	project, found := api.store.GetProject(slug)
	if !found {
		writeJSON(w, http.StatusNotFound, map[string]string{
			"error": "project not found",
		})
		return
	}

	writeJSON(w, http.StatusOK, project)
}

func (api *API) CreateContact(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	var input models.ContactInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid request body",
		})
		return
	}

	input.Name = strings.TrimSpace(input.Name)
	input.Email = strings.TrimSpace(input.Email)
	input.Message = strings.TrimSpace(input.Message)

	if input.Name == "" || input.Email == "" || input.Message == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "name, email, and message are required",
		})
		return
	}

	if _, err := mail.ParseAddress(input.Email); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"error": "enter a valid email address",
		})
		return
	}

	message, err := api.store.SaveContact(r.Context(), input)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "unable to store message",
		})
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{
		"message": "Thanks — your note has been saved.",
		"item":    message,
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/go-chi/chi/v5"

	"patrickfanella.co/api/internal/models"
)

type stubStore struct {
	databaseEnabled bool
	listProjects    []models.Project
	listErr         error
	project         models.Project
	projectErr      error
	contact         models.ContactMessage
	contactErr      error
}

func (s stubStore) DatabaseEnabled() bool {
	return s.databaseEnabled
}

func (s stubStore) ListProjects(context.Context) ([]models.Project, error) {
	return s.listProjects, s.listErr
}

func (s stubStore) GetProject(context.Context, string) (models.Project, error) {
	return s.project, s.projectErr
}

func (s stubStore) SaveContact(context.Context, models.ContactInput) (models.ContactMessage, error) {
	return s.contact, s.contactErr
}

func TestListProjectsReturnsWrappedPayload(t *testing.T) {
	api := New(stubStore{listProjects: []models.Project{{Slug: "demo", Title: "Demo"}}})
	req := httptest.NewRequest(http.MethodGet, "/api/projects", nil)
	res := httptest.NewRecorder()

	api.ListProjects(res, req)

	if res.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.Code)
	}

	var payload models.ProjectListResponse
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if len(payload.Items) != 1 || payload.Items[0].Slug != "demo" {
		t.Fatalf("unexpected items payload: %#v", payload.Items)
	}
}

func TestGetProjectReturnsWrappedPayload(t *testing.T) {
	api := New(stubStore{project: models.Project{Slug: "demo", Title: "Demo"}})
	req := httptest.NewRequest(http.MethodGet, "/api/projects/demo", nil)
	req = withSlug(req, "demo")
	res := httptest.NewRecorder()

	api.GetProject(res, req)

	if res.Code != http.StatusOK {
		t.Fatalf("expected 200, got %d", res.Code)
	}

	var payload models.ProjectDetailResponse
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if payload.Item.Slug != "demo" {
		t.Fatalf("unexpected item payload: %#v", payload.Item)
	}
}

func TestGetProjectReturnsStructuredNotFound(t *testing.T) {
	api := New(stubStore{projectErr: models.ErrProjectNotFound})
	req := httptest.NewRequest(http.MethodGet, "/api/projects/missing", nil)
	req = withSlug(req, "missing")
	res := httptest.NewRecorder()

	api.GetProject(res, req)

	assertErrorResponse(t, res, http.StatusNotFound, "project_not_found")
}

func TestListProjectsReturnsStructuredInternalError(t *testing.T) {
	api := New(stubStore{listErr: errors.New("boom")})
	req := httptest.NewRequest(http.MethodGet, "/api/projects", nil)
	res := httptest.NewRecorder()

	api.ListProjects(res, req)

	assertErrorResponse(t, res, http.StatusInternalServerError, "internal_error")
}

func TestCreateContactMalformedJSON(t *testing.T) {
	api := New(stubStore{})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString("{"))
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusBadRequest, "invalid_json")
}

func TestCreateContactValidationFailureIncludesFields(t *testing.T) {
	api := New(stubStore{})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"P","email":"bad","message":"short"}`))
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	if res.Code != http.StatusBadRequest {
		t.Fatalf("expected 400, got %d", res.Code)
	}

	var payload models.ErrorResponse
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if payload.Error.Code != "validation_error" {
		t.Fatalf("expected validation_error, got %#v", payload.Error)
	}

	if payload.Error.Fields["name"] == "" || payload.Error.Fields["email"] == "" || payload.Error.Fields["message"] == "" {
		t.Fatalf("expected validation fields, got %#v", payload.Error.Fields)
	}
}

func TestCreateContactDatabaseUnavailable(t *testing.T) {
	api := New(stubStore{contactErr: models.ErrDatabaseUnavailable})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusServiceUnavailable, "database_unavailable")
}

func TestCreateContactPersistenceError(t *testing.T) {
	api := New(stubStore{contactErr: errors.New("insert failed")})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusInternalServerError, "internal_error")
}

func TestCreateContactSuccess(t *testing.T) {
	api := New(stubStore{contact: models.ContactMessage{ID: 7, Name: "Patrick", Email: "patrick@example.com", Message: "I would like to talk about one of your projects."}})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	if res.Code != http.StatusCreated {
		t.Fatalf("expected 201, got %d", res.Code)
	}

	var payload models.ContactSubmissionResponse
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if payload.Item.ID != 7 || payload.Message == "" {
		t.Fatalf("unexpected success payload: %#v", payload)
	}
}

func withSlug(req *http.Request, slug string) *http.Request {
	rctx := chi.NewRouteContext()
	rctx.URLParams.Add("slug", slug)
	return req.WithContext(context.WithValue(req.Context(), chi.RouteCtxKey, rctx))
}

func assertErrorResponse(t *testing.T, res *httptest.ResponseRecorder, wantStatus int, wantCode string) {
	t.Helper()

	if res.Code != wantStatus {
		t.Fatalf("expected %d, got %d", wantStatus, res.Code)
	}

	var payload models.ErrorResponse
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if payload.Error.Code != wantCode {
		t.Fatalf("expected error code %q, got %#v", wantCode, payload.Error)
	}
}

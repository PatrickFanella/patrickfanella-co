package handlers

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

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
	saveCalls       int
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


func (s *stubStore) SaveContact(context.Context, models.ContactInput) (models.ContactMessage, error) {
	s.saveCalls++
	return s.contact, s.contactErr
}

func TestListProjectsReturnsWrappedPayload(t *testing.T) {
	api := New(&stubStore{listProjects: []models.Project{{Slug: "demo", Title: "Demo"}}})
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
	api := New(&stubStore{project: models.Project{Slug: "demo", Title: "Demo"}})
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
	api := New(&stubStore{projectErr: models.ErrProjectNotFound})
	req := httptest.NewRequest(http.MethodGet, "/api/projects/missing", nil)
	req = withSlug(req, "missing")
	res := httptest.NewRecorder()

	api.GetProject(res, req)

	assertErrorResponse(t, res, http.StatusNotFound, "project_not_found")
}

func TestListProjectsReturnsStructuredInternalError(t *testing.T) {
	api := New(&stubStore{listErr: errors.New("boom")})
	req := httptest.NewRequest(http.MethodGet, "/api/projects", nil)
	res := httptest.NewRecorder()

	api.ListProjects(res, req)

	assertErrorResponse(t, res, http.StatusInternalServerError, "internal_error")
}

func TestCreateContactMalformedJSON(t *testing.T) {
	api := newTestAPI(&stubStore{})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString("{"))
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusBadRequest, "invalid_json")
}

func TestCreateContactValidationFailureIncludesFields(t *testing.T) {
	api := newTestAPI(&stubStore{})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"P","email":"bad","message":"short"}`))
	req.Header.Set("Content-Type", "application/json")
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
	api := newTestAPI(&stubStore{contactErr: models.ErrDatabaseUnavailable})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusServiceUnavailable, "database_unavailable")
}

func TestCreateContactPersistenceError(t *testing.T) {
	api := newTestAPI(&stubStore{contactErr: errors.New("insert failed")})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusInternalServerError, "internal_error")
}

func TestCreateContactSuccess(t *testing.T) {
	api := newTestAPI(&stubStore{contact: models.ContactMessage{ID: 7, Name: "Patrick", Email: "patrick@example.com", Message: "I would like to talk about one of your projects."}})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	req.Header.Set("Content-Type", "application/json")
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

func TestCreateContactRejectsUnsupportedMediaType(t *testing.T) {
	api := newTestAPI(&stubStore{})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick"}`))
	req.Header.Set("Content-Type", "text/plain")
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusUnsupportedMediaType, "unsupported_media_type")
}

func TestCreateContactRejectsUnexpectedOrigin(t *testing.T) {
	api := newTestAPI(&stubStore{})
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "https://evil.example")
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusForbidden, "forbidden_origin")
}

func TestCreateContactSilentlyAcceptsHoneypotSubmissions(t *testing.T) {
	store := &stubStore{}
	api := newTestAPI(store)
	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects.","website":"https://spam.example"}`))
	req.Header.Set("Content-Type", "application/json")
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	if res.Code != http.StatusAccepted {
		t.Fatalf("expected 202, got %d", res.Code)
	}

	if store.saveCalls != 0 {
		t.Fatalf("expected honeypot submission to bypass persistence, got %d save calls", store.saveCalls)
	}

	var payload models.ContactSubmissionResponse
	if err := json.NewDecoder(res.Body).Decode(&payload); err != nil {
		t.Fatalf("decode response: %v", err)
	}

	if payload.Message == "" {
		t.Fatalf("expected success message, got %#v", payload)
	}
}

func TestCreateContactRejectsRateLimitedRequests(t *testing.T) {
	store := &stubStore{contact: models.ContactMessage{ID: 1, Name: "Patrick", Email: "patrick@example.com", Message: "I would like to talk about one of your projects."}}
	api := New(store, ContactSecurityConfig{
		AllowedOrigin:        "http://localhost:5173",
		MaxBodyBytes:         16 * 1024,
		RateLimitMaxRequests: 1,
		RateLimitWindow:      time.Minute,
	})

	first := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	first.Header.Set("Content-Type", "application/json")
	first.Header.Set("Origin", "http://localhost:5173")
	first.RemoteAddr = "127.0.0.1:4000"
	firstRes := httptest.NewRecorder()

	api.CreateContact(firstRes, first)

	if firstRes.Code != http.StatusCreated {
		t.Fatalf("expected first request to succeed, got %d", firstRes.Code)
	}

	second := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	second.Header.Set("Content-Type", "application/json")
	second.Header.Set("Origin", "http://localhost:5173")
	second.RemoteAddr = "127.0.0.1:4001"
	secondRes := httptest.NewRecorder()

	api.CreateContact(secondRes, second)

	assertErrorResponse(t, secondRes, http.StatusTooManyRequests, "rate_limited")
}

func TestCreateContactRejectsOversizedPayload(t *testing.T) {
	api := New(&stubStore{}, ContactSecurityConfig{
		AllowedOrigin:        "http://localhost:5173",
		MaxBodyBytes:         32,
		RateLimitMaxRequests: 5,
		RateLimitWindow:      time.Minute,
	})

	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString(`{"name":"Patrick","email":"patrick@example.com","message":"I would like to talk about one of your projects."}`))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "http://localhost:5173")
	req.RemoteAddr = "127.0.0.1:4000"
	res := httptest.NewRecorder()

	api.CreateContact(res, req)

	assertErrorResponse(t, res, http.StatusRequestEntityTooLarge, "payload_too_large")
}

func newTestAPI(store *stubStore) *API {
	return New(store, ContactSecurityConfig{
		AllowedOrigin:        "http://localhost:5173",
		MaxBodyBytes:         16 * 1024,
		RateLimitMaxRequests: 5,
		RateLimitWindow:      time.Minute,
	})
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

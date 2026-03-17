package models

import (
	"errors"
	"time"
)

var (
	ErrDatabaseUnavailable = errors.New("database unavailable")
	ErrProjectNotFound     = errors.New("project not found")
)

type Project struct {
	Slug        string   `json:"slug"`
	Title       string   `json:"title"`
	Summary     string   `json:"summary"`
	Description string   `json:"description"`
	Role        string   `json:"role"`
	Year        int      `json:"year"`
	Stack       []string `json:"stack"`
	Featured    bool     `json:"featured"`
	RepoURL     string   `json:"repoUrl,omitempty"`
	LiveURL     string   `json:"liveUrl,omitempty"`
	Highlights  []string `json:"highlights"`
}

type ProjectListResponse struct {
	Items []Project `json:"items"`
}

type ProjectDetailResponse struct {
	Item Project `json:"item"`
}

type APIError struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Fields  map[string]string `json:"fields,omitempty"`
}

type ErrorResponse struct {
	Error APIError `json:"error"`
}

type ContactInput struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type ContactMessage struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"createdAt"`
}

type ContactSubmissionResponse struct {
	Message string         `json:"message"`
	Item    ContactMessage `json:"item"`
}

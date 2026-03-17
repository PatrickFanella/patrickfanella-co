package models

import "time"

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

var StarterProjects = []Project{
	{
		Slug:        "case-study-one",
		Title:       "Case Study One",
		Summary:     "Starter placeholder for a polished project write-up with measurable outcomes and clear engineering decisions.",
		Description: "Replace this with one of your strongest portfolio projects and expand it into a full case study.",
		Role:        "Full stack developer",
		Year:        2026,
		Stack:       []string{"React", "TypeScript", "Go", "PostgreSQL"},
		Featured:    true,
		Highlights:  []string{"Project framing", "Architecture rationale", "Delivery outcomes"},
	},
	{
		Slug:        "case-study-two",
		Title:       "Case Study Two",
		Summary:     "Second featured project slot for a product-focused build, redesign, or tool you are proud to showcase.",
		Description: "Use this slot for a project with a stronger UI story, integration challenge, or cleaner design system.",
		Role:        "Frontend / product engineer",
		Year:        2025,
		Stack:       []string{"React", "Vite", "Design Systems"},
		Featured:    true,
		Highlights:  []string{"Responsive UI", "Interaction polish", "Technical clarity"},
	},
	{
		Slug:        "case-study-three",
		Title:       "Case Study Three",
		Summary:     "Third placeholder reserved for an API-heavy build, data project, or full-stack experiment worth explaining well.",
		Description: "Swap in a backend-heavy project that helps reinforce your full-stack strengths.",
		Role:        "Backend / full stack developer",
		Year:        2024,
		Stack:       []string{"Go", "PostgreSQL", "REST APIs"},
		Featured:    false,
		Highlights:  []string{"Data modeling", "API design", "Production thinking"},
	},
}

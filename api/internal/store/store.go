package store

import (
	"context"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"patrickfanella.co/api/internal/models"
)

type Store struct {
	db       *pgxpool.Pool
	mu       sync.Mutex
	contacts []models.ContactMessage
}

func New(ctx context.Context, databaseURL string) (*Store, error) {
	if databaseURL == "" {
		return &Store{}, nil
	}

	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return &Store{}, err
	}

	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return &Store{}, err
	}

	return &Store{db: pool}, nil
}

func (s *Store) Close() {
	if s == nil || s.db == nil {
		return
	}

	s.db.Close()
}

func (s *Store) DatabaseEnabled() bool {
	return s != nil && s.db != nil
}

func (s *Store) ListProjects() []models.Project {
	projects := make([]models.Project, len(models.StarterProjects))
	copy(projects, models.StarterProjects)
	return projects
}

func (s *Store) GetProject(slug string) (models.Project, bool) {
	for _, project := range models.StarterProjects {
		if project.Slug == slug {
			return project, true
		}
	}

	return models.Project{}, false
}

func (s *Store) SaveContact(ctx context.Context, input models.ContactInput) (models.ContactMessage, error) {
	if s.db == nil {
		s.mu.Lock()
		defer s.mu.Unlock()

		message := models.ContactMessage{
			ID:        int64(len(s.contacts) + 1),
			Name:      input.Name,
			Email:     input.Email,
			Message:   input.Message,
			CreatedAt: time.Now().UTC(),
		}

		s.contacts = append(s.contacts, message)
		return message, nil
	}

	message := models.ContactMessage{
		Name:    input.Name,
		Email:   input.Email,
		Message: input.Message,
	}

	err := s.db.QueryRow(
		ctx,
		`INSERT INTO contact_messages (name, email, message)
		 VALUES ($1, $2, $3)
		 RETURNING id, created_at`,
		input.Name,
		input.Email,
		input.Message,
	).Scan(&message.ID, &message.CreatedAt)
	if err != nil {
		return models.ContactMessage{}, err
	}

	return message, nil
}

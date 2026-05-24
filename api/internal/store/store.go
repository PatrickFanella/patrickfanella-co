package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"sync"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"patrickfanella.co/api/internal/models"
)

type Store struct {
	mu          sync.RWMutex
	db          *pgxpool.Pool
	databaseURL string
	logger      *slog.Logger
}

const projectSelect = `
SELECT
	p.slug,
	p.title,
	p.kind,
	p.summary,
	p.description,
	p.role,
	p.year,
	p.featured,
	p.repo_url,
	p.live_url,
	COALESCE(
		ARRAY(
			SELECT t.name
			FROM project_tag_map ptm
			JOIN project_tags t ON t.id = ptm.tag_id
			WHERE ptm.project_id = p.id
			ORDER BY t.name
		),
		ARRAY[]::TEXT[]
	) AS stack,
	COALESCE(p.highlights, ARRAY[]::TEXT[]) AS highlights,
	COALESCE(p.architecture, ARRAY[]::TEXT[]) AS architecture,
	COALESCE(p.lessons_learned, ARRAY[]::TEXT[]) AS lessons_learned,
	COALESCE(p.media, '[]'::JSONB) AS media
FROM projects p
`

// ConnectConfig controls retry behaviour for initial and background connections.
type ConnectConfig struct {
	MaxAttempts int
	InitialWait time.Duration
	MaxWait     time.Duration
}

func defaultConnectConfig() ConnectConfig {
	return ConnectConfig{
		MaxAttempts: 10,
		InitialWait: 500 * time.Millisecond,
		MaxWait:     10 * time.Second,
	}
}

// New creates a Store and attempts to connect to the database with retry/backoff.
// If the database URL is empty, the Store starts with no database (degraded mode).
// If all connection attempts fail, the Store is returned in degraded mode with the
// last error -- the caller can use TryReconnect later.
func New(ctx context.Context, databaseURL string, opts ...ConnectConfig) (*Store, error) {
	cfg := defaultConnectConfig()
	if len(opts) > 0 {
		cfg = opts[0]
	}

	s := &Store{databaseURL: databaseURL}

	if databaseURL == "" {
		return s, nil
	}

	err := s.connectWithRetry(ctx, cfg)
	return s, err
}

func (s *Store) connectWithRetry(ctx context.Context, cfg ConnectConfig) error {
	wait := cfg.InitialWait
	var lastErr error

	for attempt := 1; attempt <= cfg.MaxAttempts; attempt++ {
		connCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
		pool, err := pgxpool.New(connCtx, s.databaseURL)
		if err != nil {
			cancel()
			lastErr = err
			s.logRetry(attempt, cfg.MaxAttempts, wait, err)
			if attempt < cfg.MaxAttempts {
				time.Sleep(wait)
				wait = min(wait*2, cfg.MaxWait)
			}
			continue
		}

		if err := pool.Ping(connCtx); err != nil {
			cancel()
			pool.Close()
			lastErr = err
			s.logRetry(attempt, cfg.MaxAttempts, wait, err)
			if attempt < cfg.MaxAttempts {
				time.Sleep(wait)
				wait = min(wait*2, cfg.MaxWait)
			}
			continue
		}
		cancel()

		s.mu.Lock()
		s.db = pool
		s.mu.Unlock()
		return nil
	}

	return lastErr
}

func (s *Store) logRetry(attempt, max int, nextWait time.Duration, err error) {
	if s.logger != nil {
		s.logger.Warn("database connection attempt failed",
			slog.Int("attempt", attempt),
			slog.Int("max_attempts", max),
			slog.Duration("next_wait", nextWait),
			slog.Any("error", err),
		)
	}
}

// SetLogger sets the logger used for connection retry messages.
func (s *Store) SetLogger(logger *slog.Logger) {
	s.logger = logger
}

// TryReconnect attempts to re-establish a database connection if the current
// one is nil or unhealthy. It is safe to call from a background goroutine.
func (s *Store) TryReconnect(ctx context.Context) error {
	if s.databaseURL == "" {
		return errors.New("no database URL configured")
	}

	// If already connected and healthy, nothing to do.
	s.mu.RLock()
	pool := s.db
	s.mu.RUnlock()

	if pool != nil {
		if err := pool.Ping(ctx); err == nil {
			return nil
		}
		// Connection is stale -- close it and try fresh.
		pool.Close()
		s.mu.Lock()
		s.db = nil
		s.mu.Unlock()
	}

	return s.connectWithRetry(ctx, ConnectConfig{
		MaxAttempts: 1,
		InitialWait: 0,
		MaxWait:     0,
	})
}

func (s *Store) Close() {
	if s == nil {
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	if s.db != nil {
		s.db.Close()
		s.db = nil
	}
}

func (s *Store) DB() *pgxpool.Pool {
	if s == nil {
		return nil
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.db
}

func (s *Store) DatabaseEnabled() bool {
	if s == nil {
		return false
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.db != nil
}

func (s *Store) ListProjects(ctx context.Context) ([]models.Project, error) {
	s.mu.RLock()
	pool := s.db
	s.mu.RUnlock()

	if pool == nil {
		return nil, models.ErrDatabaseUnavailable
	}

	rows, err := pool.Query(ctx, projectSelect+`
ORDER BY p.featured DESC, p.sort_order ASC, p.year DESC, p.created_at DESC, p.slug ASC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	projects := make([]models.Project, 0)
	for rows.Next() {
		project, err := scanProject(rows.Scan)
		if err != nil {
			return nil, err
		}

		projects = append(projects, project)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return projects, nil
}

func (s *Store) GetProject(ctx context.Context, slug string) (models.Project, error) {
	s.mu.RLock()
	pool := s.db
	s.mu.RUnlock()

	if pool == nil {
		return models.Project{}, models.ErrDatabaseUnavailable
	}

	project, err := scanProject(pool.QueryRow(ctx, projectSelect+`WHERE p.slug = $1`, slug).Scan)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) || errors.Is(err, sql.ErrNoRows) {
			return models.Project{}, models.ErrProjectNotFound
		}

		return models.Project{}, err
	}

	return project, nil
}

func (s *Store) SaveContact(ctx context.Context, input models.ContactInput) (models.ContactMessage, error) {
	s.mu.RLock()
	pool := s.db
	s.mu.RUnlock()

	if pool == nil {
		return models.ContactMessage{}, models.ErrDatabaseUnavailable
	}

	message := models.ContactMessage{
		Name:    input.Name,
		Email:   input.Email,
		Message: input.Message,
	}

	err := pool.QueryRow(
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

func scanProject(scan func(dest ...any) error) (models.Project, error) {
	var project models.Project
	var repoURL sql.NullString
	var liveURL sql.NullString
	var mediaPayload []byte

	err := scan(
		&project.Slug,
		&project.Title,
		&project.Kind,
		&project.Summary,
		&project.Description,
		&project.Role,
		&project.Year,
		&project.Featured,
		&repoURL,
		&liveURL,
		&project.Stack,
		&project.Highlights,
		&project.Architecture,
		&project.Lessons,
		&mediaPayload,
	)
	if err != nil {
		return models.Project{}, err
	}

	if repoURL.Valid {
		project.RepoURL = repoURL.String
	}

	if liveURL.Valid {
		project.LiveURL = liveURL.String
	}

	if project.Kind == "" {
		project.Kind = "case-study"
	}

	if len(mediaPayload) > 0 {
		if err := json.Unmarshal(mediaPayload, &project.Media); err != nil {
			return models.Project{}, fmt.Errorf("decode project media: %w", err)
		}
	}

	return project, nil
}

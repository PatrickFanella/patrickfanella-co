package store

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"patrickfanella.co/api/internal/models"
)

type Store struct {
	db *pgxpool.Pool
}

const projectSelect = `
SELECT
	p.slug,
	p.title,
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

func (s *Store) DB() *pgxpool.Pool {
	if s == nil {
		return nil
	}

	return s.db
}

func (s *Store) DatabaseEnabled() bool {
	return s != nil && s.db != nil
}

func (s *Store) ListProjects(ctx context.Context) ([]models.Project, error) {
	if s == nil || s.db == nil {
		return nil, models.ErrDatabaseUnavailable
	}

	rows, err := s.db.Query(ctx, projectSelect+`
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
	if s == nil || s.db == nil {
		return models.Project{}, models.ErrDatabaseUnavailable
	}

	project, err := scanProject(s.db.QueryRow(ctx, projectSelect+`WHERE p.slug = $1`, slug).Scan)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) || errors.Is(err, sql.ErrNoRows) {
			return models.Project{}, models.ErrProjectNotFound
		}

		return models.Project{}, err
	}

	return project, nil
}

func (s *Store) SaveContact(ctx context.Context, input models.ContactInput) (models.ContactMessage, error) {
	if s.db == nil {
		return models.ContactMessage{}, models.ErrDatabaseUnavailable
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

func scanProject(scan func(dest ...any) error) (models.Project, error) {
	var project models.Project
	var repoURL sql.NullString
	var liveURL sql.NullString
	var mediaPayload []byte

	err := scan(
		&project.Slug,
		&project.Title,
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

	if len(mediaPayload) > 0 {
		if err := json.Unmarshal(mediaPayload, &project.Media); err != nil {
			return models.Project{}, fmt.Errorf("decode project media: %w", err)
		}
	}

	return project, nil
}

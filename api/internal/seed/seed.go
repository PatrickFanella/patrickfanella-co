package seed

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Portfolio struct {
	Projects []Project `json:"projects"`
}

type Project struct {
	Slug        string   `json:"slug"`
	Title       string   `json:"title"`
	Summary     string   `json:"summary"`
	Description string   `json:"description"`
	Role        string   `json:"role"`
	Year        int      `json:"year"`
	RepoURL     string   `json:"repoUrl,omitempty"`
	LiveURL     string   `json:"liveUrl,omitempty"`
	Featured    bool     `json:"featured"`
	SortOrder   int      `json:"sortOrder"`
	Tags        []string `json:"tags"`
	Highlights  []string `json:"highlights"`
}

func DefaultSeedPath() (string, error) {
	candidates := []string{
		filepath.Join("db", "seed", "portfolio.json"),
		filepath.Join("..", "db", "seed", "portfolio.json"),
		filepath.Join("..", "..", "db", "seed", "portfolio.json"),
		filepath.Join("..", "..", "..", "db", "seed", "portfolio.json"),
	}

	for _, candidate := range candidates {
		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}
	}

	return "", fmt.Errorf("seed file not found in expected locations")
}

func Load(path string) (Portfolio, error) {
	content, err := os.ReadFile(path)
	if err != nil {
		return Portfolio{}, err
	}

	var portfolio Portfolio
	if err := json.Unmarshal(content, &portfolio); err != nil {
		return Portfolio{}, err
	}

	if len(portfolio.Projects) == 0 {
		return Portfolio{}, fmt.Errorf("seed file %q does not contain any projects", path)
	}

	return portfolio, nil
}

func Run(ctx context.Context, pool *pgxpool.Pool, portfolio Portfolio, logger *log.Logger) error {
	if pool == nil {
		return fmt.Errorf("database pool is required")
	}

	if logger == nil {
		logger = log.New(os.Stdout, "", log.LstdFlags)
	}

	tx, err := pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return err
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	slugs := make([]string, 0, len(portfolio.Projects))
	for _, project := range portfolio.Projects {
		logger.Printf("seeding project slug=%s featured=%t", project.Slug, project.Featured)

		var projectID int64
		err := tx.QueryRow(
			ctx,
			`INSERT INTO projects (slug, title, summary, description, role, year, repo_url, live_url, featured, sort_order, highlights)
			 VALUES ($1, $2, $3, $4, $5, $6, NULLIF($7, ''), NULLIF($8, ''), $9, $10, $11)
			 ON CONFLICT (slug) DO UPDATE SET
			   title = EXCLUDED.title,
			   summary = EXCLUDED.summary,
			   description = EXCLUDED.description,
			   role = EXCLUDED.role,
			   year = EXCLUDED.year,
			   repo_url = EXCLUDED.repo_url,
			   live_url = EXCLUDED.live_url,
			   featured = EXCLUDED.featured,
			   sort_order = EXCLUDED.sort_order,
			   highlights = EXCLUDED.highlights
			 RETURNING id`,
			project.Slug,
			project.Title,
			project.Summary,
			project.Description,
			project.Role,
			project.Year,
			project.RepoURL,
			project.LiveURL,
			project.Featured,
			project.SortOrder,
			project.Highlights,
		).Scan(&projectID)
		if err != nil {
			return err
		}

		if _, err := tx.Exec(ctx, `DELETE FROM project_tag_map WHERE project_id = $1`, projectID); err != nil {
			return err
		}

		for _, tag := range project.Tags {
			var tagID int64
			err := tx.QueryRow(
				ctx,
				`INSERT INTO project_tags (name)
				 VALUES ($1)
				 ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
				 RETURNING id`,
				tag,
			).Scan(&tagID)
			if err != nil {
				return err
			}

			if _, err := tx.Exec(
				ctx,
				`INSERT INTO project_tag_map (project_id, tag_id)
				 VALUES ($1, $2)
				 ON CONFLICT (project_id, tag_id) DO NOTHING`,
				projectID,
				tagID,
			); err != nil {
				return err
			}
		}

		slugs = append(slugs, project.Slug)
	}

	if _, err := tx.Exec(ctx, `DELETE FROM projects WHERE NOT (slug = ANY($1))`, slugs); err != nil {
		return err
	}

	if _, err := tx.Exec(ctx, `DELETE FROM project_tags WHERE NOT EXISTS (SELECT 1 FROM project_tag_map WHERE project_tag_map.tag_id = project_tags.id)`); err != nil {
		return err
	}

	if err := tx.Commit(ctx); err != nil {
		return err
	}

	logger.Printf("seed complete projects=%d", len(portfolio.Projects))
	return nil
}

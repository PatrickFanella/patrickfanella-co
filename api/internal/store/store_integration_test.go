package store

import (
	"context"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"testing"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"patrickfanella.co/api/internal/models"
	"patrickfanella.co/api/internal/seed"
)

func TestListProjectsAndGetProjectUseSeededPostgresData(t *testing.T) {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		t.Skip("DATABASE_URL is not set")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		t.Skipf("database unavailable: %v", err)
	}
	defer pool.Close()

	if err := applyMigrations(ctx, pool); err != nil {
		t.Fatalf("apply migrations: %v", err)
	}

	if err := resetProjectTables(ctx, pool); err != nil {
		t.Fatalf("reset tables: %v", err)
	}

	seedPath, err := seed.DefaultSeedPath()
	if err != nil {
		t.Fatalf("default seed path: %v", err)
	}

	portfolio, err := seed.Load(seedPath)
	if err != nil {
		t.Fatalf("load seed file: %v", err)
	}

	if err := seed.Run(ctx, pool, portfolio, nil); err != nil {
		t.Fatalf("run seed: %v", err)
	}

	st, err := New(ctx, databaseURL)
	if err != nil {
		t.Fatalf("new store: %v", err)
	}
	defer st.Close()

	projects, err := st.ListProjects(ctx)
	if err != nil {
		t.Fatalf("list projects: %v", err)
	}

	if len(projects) != len(portfolio.Projects) {
		t.Fatalf("expected %d projects, got %d", len(portfolio.Projects), len(projects))
	}

	featuredCount := 0
	for _, p := range projects {
		if p.Featured {
			featuredCount++
		}
	}
	if featuredCount != 4 {
		t.Fatalf("expected 4 featured projects, got %d", featuredCount)
	}
	if !projects[0].Featured {
		t.Fatalf("expected first project to be featured, got %#v", projects[0])
	}

	first, err := st.GetProject(ctx, portfolio.Projects[0].Slug)
	if err != nil {
		t.Fatalf("get project: %v", err)
	}

	if first.Title != portfolio.Projects[0].Title {
		t.Fatalf("expected title %q, got %q", portfolio.Projects[0].Title, first.Title)
	}

	sortedTags := append([]string(nil), portfolio.Projects[0].Tags...)
	sort.Strings(sortedTags)
	if strings.Join(first.Stack, ",") != strings.Join(sortedTags, ",") {
		t.Fatalf("expected tags %v, got %v", sortedTags, first.Stack)
	}

	if strings.Join(first.Architecture, "|") != strings.Join(portfolio.Projects[0].Architecture, "|") {
		t.Fatalf("expected architecture %v, got %v", portfolio.Projects[0].Architecture, first.Architecture)
	}

	if strings.Join(first.Lessons, "|") != strings.Join(portfolio.Projects[0].Lessons, "|") {
		t.Fatalf("expected lessons %v, got %v", portfolio.Projects[0].Lessons, first.Lessons)
	}

	if len(first.Media) != len(portfolio.Projects[0].Media) {
		t.Fatalf("expected %d media items, got %d", len(portfolio.Projects[0].Media), len(first.Media))
	}

	if len(first.Media) > 0 && first.Media[0].Src != portfolio.Projects[0].Media[0].Src {
		t.Fatalf("expected first media src %q, got %q", portfolio.Projects[0].Media[0].Src, first.Media[0].Src)
	}

	_, err = st.GetProject(ctx, "does-not-exist")
	if !strings.Contains(err.Error(), models.ErrProjectNotFound.Error()) {
		t.Fatalf("expected project not found error, got %v", err)
	}
}

func applyMigrations(ctx context.Context, pool *pgxpool.Pool) error {
	files, err := migrationFiles()
	if err != nil {
		return err
	}

	for _, file := range files {
		content, err := os.ReadFile(file)
		if err != nil {
			return err
		}

		if _, err := pool.Exec(ctx, string(content)); err != nil {
			return err
		}
	}

	return nil
}

func migrationFiles() ([]string, error) {
	patterns := []string{
		filepath.Join("..", "..", "..", "db", "migrations", "*.sql"),
		filepath.Join("..", "..", "..", "..", "db", "migrations", "*.sql"),
	}

	for _, pattern := range patterns {
		files, err := filepath.Glob(pattern)
		if err != nil {
			return nil, err
		}

		if len(files) > 0 {
			sort.Strings(files)
			return files, nil
		}
	}

	return nil, os.ErrNotExist
}

func resetProjectTables(ctx context.Context, pool *pgxpool.Pool) error {
	_, err := pool.Exec(ctx, `TRUNCATE project_tag_map, project_tags, projects RESTART IDENTITY CASCADE`)
	return err
}

package main

import (
	"context"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"patrickfanella.co/api/internal/config"
)

func main() {
	cfg := config.Load()
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required to apply migrations")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("unable to connect to database: %v", err)
	}
	defer pool.Close()

	if err := pool.Ping(ctx); err != nil {
		log.Fatalf("unable to reach database: %v", err)
	}

	paths, err := migrationFiles()
	if err != nil {
		log.Fatalf("unable to locate migrations: %v", err)
	}

	for _, path := range paths {
		content, err := os.ReadFile(path)
		if err != nil {
			log.Fatalf("unable to read migration %s: %v", path, err)
		}

		log.Printf("applying migration %s", filepath.Base(path))
		if _, err := pool.Exec(ctx, string(content)); err != nil {
			log.Fatalf("migration %s failed: %v", filepath.Base(path), err)
		}
	}

	log.Printf("applied %d migration(s)", len(paths))
}

func migrationFiles() ([]string, error) {
	patterns := []string{
		filepath.Join("db", "migrations", "*.sql"),
		filepath.Join("..", "db", "migrations", "*.sql"),
		filepath.Join("..", "..", "db", "migrations", "*.sql"),
		filepath.Join("..", "..", "..", "db", "migrations", "*.sql"),
	}

	for _, pattern := range patterns {
		paths, err := filepath.Glob(pattern)
		if err != nil {
			return nil, err
		}

		if len(paths) == 0 {
			continue
		}

		sort.Strings(paths)
		return paths, nil
	}

	return nil, fmt.Errorf("%w: db/migrations/*.sql", fs.ErrNotExist)
}

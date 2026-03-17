package main

import (
	"context"
	"flag"
	"log"
	"os"
	"time"

	"patrickfanella.co/api/internal/config"
	"patrickfanella.co/api/internal/seed"
	"patrickfanella.co/api/internal/store"
)

func main() {
	defaultPath, err := seed.DefaultSeedPath()
	if err != nil {
		log.Fatal(err)
	}

	seedPath := flag.String("file", defaultPath, "path to the portfolio seed file")
	flag.Parse()

	cfg := config.Load()
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required to seed portfolio content")
	}

	portfolio, err := seed.Load(*seedPath)
	if err != nil {
		log.Fatalf("unable to load seed file: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	appStore, err := store.New(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("unable to connect to database: %v", err)
	}
	defer appStore.Close()

	if !appStore.DatabaseEnabled() {
		log.Fatal("database connection is not available")
	}

	logger := log.New(os.Stdout, "seed: ", log.LstdFlags)
	if err := seed.Run(ctx, appStore.DB(), portfolio, logger); err != nil {
		log.Fatalf("seed failed: %v", err)
	}

	logger.Println("portfolio seed finished successfully")
}

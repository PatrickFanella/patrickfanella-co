# Patrick Fanella Portfolio

Project-first full stack developer portfolio scaffold built with:

- `web/` — Vite + React + TypeScript frontend
- `api/` — Go + Chi starter API
- `db/migrations/` — PostgreSQL schema

## Current scaffold status

- Project plan saved in `docs/implementation-plan.md`
- Phase-0 assumptions, audit findings, and API/env contracts saved in `docs/phase-0-foundation.md`
- Frontend routes scaffolded for home, projects, project detail, and contact
- Go API scaffolded for health, projects, and contact endpoints
- Local PostgreSQL development setup added via `docker-compose.yml`
- Root environment templates added in `.env` and `.env.example`

## Baseline delivery assumptions

- The current scaffold is the implementation baseline, not throwaway work.
- v1 scope is the four public routes, curated project content, API-backed project browsing, and a working contact submission flow.
- PostgreSQL is the runtime source of truth for project content and contact submissions at launch.
- Placeholder data in `web/src/data/projects.ts` and `api/internal/models/models.go` is temporary and should be phased out from runtime use.

## Configuration

The repo currently expects these runtime variables:

- `API_PORT` — API listen port, defaults to `8080`
- `DATABASE_URL` — PostgreSQL connection string for the API
- `CORS_ORIGIN` — browser origin allowed by the API
- `VITE_API_BASE_URL` — frontend base URL for API requests

See `docs/phase-0-foundation.md` for the current contract details and launch assumptions.

## Local database bootstrap

Phase 1 adds a repeatable content bootstrap path for the portfolio database.

1. Start PostgreSQL with `docker compose up -d postgres`
2. Apply migrations in order from `db/migrations/`
3. Seed the portfolio content from the Go module with `cd api && go run ./cmd/seed`

The seed source of truth lives in `db/seed/portfolio.json` and can be rerun to refresh project and tag content in local/dev environments.

## Suggested next steps

1. Add a repeatable seed workflow for project content
2. Connect the API project routes to PostgreSQL
3. Replace starter project content with curated case studies
4. Connect the frontend project pages to the API project endpoints
5. Add launch polish for assets, SEO, testing, and deployment

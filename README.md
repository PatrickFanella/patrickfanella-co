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
2. Apply migrations with `cd api && go run ./cmd/migrate`
3. Seed the portfolio content from the Go module with `cd api && go run ./cmd/seed`

The seed source of truth lives in `db/seed/portfolio.json` and can be rerun to refresh project and tag content in local/dev environments.

Phase 3 expands the seeded project contract with architecture notes, supporting media, and lessons learned. See `docs/phase-3-content-inventory.md` for placeholder asset conventions and the remaining copy/assets still needed for a final launch pass.

## Phase 4 quality hardening

Phase 4 adds launch-quality guardrails across the public routes:

- shared empty/error/loading route states
- accessibility improvements for focus management, live regions, and reduced motion
- route-level SEO metadata plus generated `sitemap.xml` and `robots.txt`
- contact endpoint abuse protection and privacy-minded request handling
- expanded frontend, backend, and browser smoke coverage

See `docs/phase-4-quality-hardening.md` for the implementation details, runtime knobs, and release-verification checklist.

## Phase 2 smoke path

Phase 2 adds a minimal end-to-end slice across the seeded portfolio routes and live contact flow.

Recommended local verification order:

1. Start PostgreSQL with `docker compose up -d postgres`
2. Apply migrations with `cd api && go run ./cmd/migrate`
3. Seed launch content with `cd api && go run ./cmd/seed`
4. Run backend tests with `cd api && go test ./...`
5. Run frontend checks with `cd web && npm run lint && npm run test && npm run build`
6. Install Playwright browsers once with `cd web && npx playwright install chromium`
7. Run the browser smoke path with `cd web && npm run test:e2e`

## Suggested next steps

1. Add a repeatable seed workflow for project content
2. Connect the API project routes to PostgreSQL
3. Replace starter project content with curated case studies
4. Connect the frontend project pages to the API project endpoints
5. Add launch polish for assets, SEO, testing, and deployment

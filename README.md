# Patrick Fanella Portfolio

Project-first full stack developer portfolio scaffold built with:

- `web/`: Vite + React + TypeScript frontend
- `api/`: Go + Chi starter API
- `db/migrations/`: PostgreSQL schema

## Current project status

- Frontend routes are live for home, projects, project detail, and contact
- Go API supports health, projects, and contact flows backed by PostgreSQL
- Seed content now includes richer case-study structure for highlights, architecture, lessons, and media
- Local PostgreSQL and production-shaped container workflows are supported through `docker-compose.yml`
- Current operator references live in `docs/deployment.md`, `docs/runbook.md`, and `docs/launch-checklist.md`

## Baseline delivery assumptions

- The current scaffold is the implementation baseline, not throwaway work.
- v1 scope is the four public routes, curated project content, API-backed project browsing, and a working contact submission flow.
- PostgreSQL is the runtime source of truth for project content and contact submissions at launch.
- Placeholder data in `web/src/data/projects.ts` and `api/internal/models/models.go` is temporary and should be phased out from runtime use.

## Configuration

The repo currently expects these runtime variables:

- `API_PORT`: API listen port, defaults to `8080`
- `DATABASE_URL`: PostgreSQL connection string for the API
- `CORS_ORIGIN`: browser origin allowed by the API
- `VITE_API_BASE_URL`: frontend base URL for API requests

See `docs/deployment.md` for the current runtime contract and `docs/runbook.md` for the day-to-day workflow.

## Local database bootstrap

Phase 1 adds a repeatable content bootstrap path for the portfolio database.

1. Start PostgreSQL with `docker compose up -d postgres`
2. Apply migrations with `cd api && go run ./cmd/migrate`
3. Seed the portfolio content from the Go module with `cd api && go run ./cmd/seed`

The seed source of truth lives in `db/seed/portfolio.json` and can be rerun to refresh project and tag content in local/dev environments. The seeded contract now includes architecture notes, supporting media, and lessons learned for case-study pages.

## Phase 4 quality hardening

Phase 4 adds launch-quality guardrails across the public routes:

- shared empty/error/loading route states
- accessibility improvements for focus management, live regions, and reduced motion
- route-level SEO metadata plus generated `sitemap.xml` and `robots.txt`
- contact endpoint abuse protection and privacy-minded request handling
- expanded frontend, backend, and browser smoke coverage

The current release verification and runtime guidance now live in `docs/launch-checklist.md`, `docs/deployment.md`, and `docs/runbook.md`.

## Phase 5 release and operations

Phase 5 adds the launch-facing baseline needed to operate the portfolio as a real site instead of a local-only project:

- optional webhook notifications for new contact submissions
- opt-in privacy-safe Plausible analytics for page views and outbound links
- structured API request logging and richer `/api/health` diagnostics
- representative containerized deployment topology for `web`, `api`, and `postgres`
- operator docs for setup, release, troubleshooting, rollback, and launch verification

Primary docs:

- `docs/deployment.md`: topology, secrets, env contract, and container workflow
- `docs/runbook.md`: day-to-day operator and release steps
- `docs/launch-checklist.md`: reusable go/no-go verification pass

To boot the full stack locally in containers:

1. Copy `.env.example` to `.env` and fill any required values.
2. Run `docker compose --profile stack up --build`.
3. Visit the web app at `http://localhost:4173` and the API health endpoint at `http://localhost:8080/api/health`.

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

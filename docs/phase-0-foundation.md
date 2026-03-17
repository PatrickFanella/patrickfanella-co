# Phase 0 — Delivery assumptions, scaffold audit, and application contracts

This document implements the planning work described by issues #3, #8, and #9.

It is the canonical phase-0 reference for:

- what the current scaffold already provides
- what still counts as in-scope for v1
- which parts of the repo should be iterated on versus phased out
- the initial runtime and API contracts that later implementation work should follow

## Baseline assumptions

### Current scaffold is the baseline

The repository already contains a usable foundation across `web/`, `api/`, `db/`, `docker-compose.yml`, `.env`, and `.env.example`.

That scaffold is **baseline work**, not throwaway code. Downstream implementation should iterate on it unless a specific file or flow is explicitly called out below as placeholder-only.

### v1 launch scope

v1 is intentionally narrow:

- four public routes: `/`, `/projects`, `/projects/:slug`, and `/contact`
- API-backed project list and project detail pages
- a working contact submission flow that persists messages
- curated project content strong enough to make the portfolio credible
- professional baseline accessibility, responsiveness, observability, and release readiness

Out of scope for v1:

- a CMS or admin interface
- authentication or user accounts
- a hosting-vendor decision beyond what is required to document release assumptions
- expanding the product beyond the portfolio and contact experience

### Launch-ready definition

For this repository, “launch-ready” means:

- the frontend renders real portfolio content from the API, not placeholder arrays
- the API reads projects from PostgreSQL and persists contact submissions to PostgreSQL
- the contact path has clear validation and failure behavior
- local setup, migrations, and seed content are repeatable from repo documentation
- the site meets a professional baseline for accessibility, SEO, and operational confidence

It does **not** mean enterprise-scale platform engineering.

### Stack and ownership assumptions

- Frontend stack stays Vite + React + TypeScript + React Router + Tailwind + React Hook Form + Zod + Framer Motion.
- Backend stack stays Go + Chi + pgx/PostgreSQL.
- PostgreSQL is the runtime source of truth for project content and contact submissions at launch.
- Curated project copy and media remain repo-managed assets for v1; no CMS is introduced.
- Root env files remain the local-development source of truth for shared runtime configuration.

### Content and data boundaries

- `web/src/data/projects.ts` is a temporary placeholder and should be removed from the runtime path once the frontend API layer exists.
- `api/internal/models.StarterProjects` is temporary placeholder content for early scaffold behavior and should be phased out from runtime project reads.
- Seeded project content checked into the repo becomes the editorial source of truth for launch, while PostgreSQL is the runtime delivery source of truth.
- Contact submissions are a database-backed feature, not an in-memory feature, once phase 1 begins.

### Open decisions intentionally left open

- final deployment vendor and topology
- analytics provider choice
- any post-launch schema expansion beyond the current v1 fields

## Scaffold audit

Status definitions used below:

- **Ready**: usable for launch work with iterative refinements only
- **Partial**: scaffold exists but still contains placeholder or blocking gaps
- **Missing**: required for launch but not meaningfully implemented yet

| Surface area | Status | Evidence in repo | Launch gap summary |
| --- | --- | --- | --- |
| Frontend routes and visual shell | Partial | `web/src/App.tsx`, `web/src/pages/*.tsx`, `web/src/layout/SiteLayout.tsx`, `web/src/components/*` | Public routes exist and the visual system is established, but project data is still static, route states are not API-driven, and launch copy is still placeholder-heavy. |
| Backend HTTP surface | Partial | `api/cmd/server/main.go`, `api/internal/handlers/api.go` | Health, projects, and contact endpoints exist, but project routes are not PostgreSQL-backed and response contracts are still inconsistent. |
| Database foundation | Partial | `db/migrations/0001_initial_schema.sql`, `docker-compose.yml` | Core tables and local Postgres exist, but there is no documented migration runner or seed workflow and the projects schema is not yet exercised by the API. |
| Config and environment handling | Partial | `.env.example`, `.env`, `api/internal/config/config.go`, `web/src/pages/ContactPage.tsx` | Required variables exist, but ownership and defaults were not explicitly documented and frontend/backend runtime assumptions were implicit. |
| Documentation and execution guidance | Partial | `README.md`, `docs/implementation-plan.md` | High-level intent exists, but phase-0 assumptions, current-state audit, and initial contracts were not previously consolidated in one source of truth. |

### Launch blockers identified by the audit

1. `web/src/data/projects.ts` is still the live data source for home, projects index, and project detail routes.
2. `api/internal/store/store.go` serves project data from `models.StarterProjects` instead of PostgreSQL.
3. `api/internal/store/store.go` silently falls back to in-memory contact storage when `DATABASE_URL` is unavailable, which is helpful during scaffolding but not sufficient for launch semantics.
4. There is no checked-in seed workflow yet for populating the `projects`, `project_tags`, and `project_tag_map` tables.
5. The frontend has no typed API client or shared fetch helpers yet.
6. The implementation plan previously implied that scaffold creation was the “next move,” even though that work already exists in the repo.

### Files to iterate on vs. phase out

#### Iterate on

- `web/src/App.tsx` and the route/page structure
- `web/src/layout/SiteLayout.tsx` and shared UI components
- `api/cmd/server/main.go`
- `api/internal/config/config.go`
- `api/internal/handlers/api.go`
- `db/migrations/0001_initial_schema.sql`
- `docker-compose.yml`
- `.env.example`

#### Phase out from runtime use

- `web/src/data/projects.ts` once the frontend API layer is in place
- `api/internal/models.StarterProjects` for runtime project delivery once seed data exists
- the in-memory project read path in `api/internal/store/store.go`
- the in-memory contact fallback as the assumed launch behavior

## Application contracts

The contracts below are the **phase-0 target contracts** that downstream work should implement and preserve. Where the current scaffold differs, the mismatch is called out explicitly.

### Runtime configuration contract

| Variable | Consumer | Default / example | Required for launch | Notes |
| --- | --- | --- | --- | --- |
| `API_PORT` | API | `8080` | No | API listen port. `api/internal/config/config.go` already defaults this to `8080`. |
| `DATABASE_URL` | API | `postgres://postgres:postgres@localhost:5432/patrickfanella?sslmode=disable` | Yes | Required for PostgreSQL-backed projects and contact persistence. Launch behavior should not assume the in-memory fallback. |
| `CORS_ORIGIN` | API | `http://localhost:5173` | Yes | Allowed browser origin for the frontend. |
| `VITE_API_BASE_URL` | Web | `http://localhost:8080` | Yes | Base URL used by the frontend for API requests. Production may point to the same origin via reverse proxy, but the variable remains the contract. |

### API routing contract

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Service health and runtime verification |
| `GET /api/projects` | Project list for the home and projects routes |
| `GET /api/projects/:slug` | Project detail payload for a single case study |
| `POST /api/contact` | Contact submission endpoint |

### JSON response contract

#### Health

`GET /api/health`

```json
{
  "status": "ok",
  "databaseEnabled": true,
  "timestamp": "2026-03-16T00:00:00Z"
}
```

This already matches the current scaffold closely enough to keep.

#### Project summary shape

```json
{
  "slug": "example-project",
  "title": "Example Project",
  "summary": "One-paragraph portfolio summary.",
  "description": "Longer case-study overview.",
  "role": "Full stack developer",
  "year": 2026,
  "stack": ["React", "TypeScript", "Go", "PostgreSQL"],
  "featured": true,
  "repoUrl": "https://github.com/example/repo",
  "liveUrl": "https://example.com",
  "highlights": ["Architecture rationale", "Delivery outcomes"]
}
```

#### Project list response

`GET /api/projects`

```json
{
  "items": [
    {
      "slug": "example-project",
      "title": "Example Project",
      "summary": "One-paragraph portfolio summary.",
      "description": "Longer case-study overview.",
      "role": "Full stack developer",
      "year": 2026,
      "stack": ["React", "TypeScript", "Go", "PostgreSQL"],
      "featured": true,
      "repoUrl": "https://github.com/example/repo",
      "liveUrl": "https://example.com",
      "highlights": ["Architecture rationale", "Delivery outcomes"]
    }
  ]
}
```

#### Project detail response

`GET /api/projects/:slug`

```json
{
  "item": {
    "slug": "example-project",
    "title": "Example Project",
    "summary": "One-paragraph portfolio summary.",
    "description": "Longer case-study overview.",
    "role": "Full stack developer",
    "year": 2026,
    "stack": ["React", "TypeScript", "Go", "PostgreSQL"],
    "featured": true,
    "repoUrl": "https://github.com/example/repo",
    "liveUrl": "https://example.com",
    "highlights": ["Architecture rationale", "Delivery outcomes"]
  }
}
```

#### Contact submission request

`POST /api/contact`

```json
{
  "name": "Patrick Fanella",
  "email": "patrick@example.com",
  "message": "I'd like to talk about a portfolio project."
}
```

#### Contact submission success response

```json
{
  "message": "Thanks — your note has been saved.",
  "item": {
    "id": 1,
    "name": "Patrick Fanella",
    "email": "patrick@example.com",
    "message": "I'd like to talk about a portfolio project.",
    "createdAt": "2026-03-16T00:00:00Z"
  }
}
```

#### Error response target

Error responses should converge on the following shape in later implementation work:

```json
{
  "error": {
    "code": "validation_error",
    "message": "name, email, and message are required"
  }
}
```

For field-level validation, a future-compatible extension is:

```json
{
  "error": {
    "code": "validation_error",
    "message": "Please correct the highlighted fields.",
    "fields": {
      "email": "Enter a valid email address."
    }
  }
}
```

### Debugging and verification contract

- Preserve the request ID middleware so responses can be correlated through `X-Request-Id`.
- Keep `GET /api/health` available for local smoke tests and deployment probes.
- Frontend work should treat loading, empty, not-found, and server-error states as first-class route states rather than exceptional edge cases.

### Content ownership contract

At launch, content ownership is:

1. curated project copy and asset references are checked into the repo
2. a repeatable seed workflow loads that content into PostgreSQL
3. the API serves PostgreSQL content to the frontend

That means runtime content should not be split permanently between `web/src/data/projects.ts` and API/database responses.

### Current scaffold mismatches to resolve in phase 1

1. `web/src/data/projects.ts` uses `year` as a string and nests external links under `links`, while the API model uses `year` as a number and top-level `repoUrl` / `liveUrl` fields.
2. `GET /api/projects` already returns an `{ "items": [...] }` envelope, while `GET /api/projects/:slug` currently returns the raw project object rather than `{ "item": ... }`.
3. Current API errors are plain `{ "error": "..." }` strings rather than structured error objects with codes.
4. Current contact behavior allows an in-memory fallback path, which is useful for scaffolding but should not remain the assumed launch contract.

## Immediate next move after phase 0

Phase 1 should start by:

1. adding a repeatable seed workflow for project content
2. replacing in-memory project reads with PostgreSQL-backed store methods
3. introducing a typed frontend API layer that implements the contracts above
4. removing runtime dependence on static placeholder project arrays

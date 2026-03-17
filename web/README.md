# Frontend workspace

The portfolio frontend is a Vite + React + TypeScript app.

## Runtime API configuration

- `VITE_API_BASE_URL` is read from the workspace root `.env` because `vite.config.ts` sets `envDir: '..'`.
- If the variable is omitted, the frontend falls back to `http://localhost:8080` for local development.

## Shared API client

`src/lib/api.ts` is the shared client layer for:

- project list requests
- project detail requests
- contact submissions

It centralizes:

- API base URL handling
- JSON parsing
- normalized error objects with codes, messages, and field errors

## Commands

- `npm run dev` — start the frontend dev server
- `npm run build` — type-check and build the frontend
- `npm run lint` — run ESLint
- `npm run test` — run frontend unit tests
- `npm run test:e2e` — run the Playwright smoke path against the seeded local stack

## Phase 2 route states

Phase 2 replaces runtime usage of `src/data/projects.ts` with the shared API client and intentional route states:

- `HomePage` renders featured projects from `GET /api/projects`
- `ProjectsPage` splits the live dataset into featured and archived sections
- `ProjectDetailPage` loads by slug from `GET /api/projects/:slug` and distinguishes not-found vs generic failures
- `ContactPage` submits directly to `POST /api/contact` and maps validation, network, and generic failures

For browser smoke coverage, seed the database first from the repo root:

1. `docker compose up -d postgres`
2. `cd ../api && go run ./cmd/migrate && go run ./cmd/seed`
3. `npx playwright install chromium` (first run only)
4. `npm run test:e2e`

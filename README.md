# Patrick Fanella Portfolio

Full-stack portfolio application built to showcase product thinking, clean engineering, and production-ready delivery. The project combines a polished React frontend, a Go API, and a PostgreSQL-backed content layer to present case-study work through a real application instead of a static brochure site.

## Why this project stands out

- **End-to-end ownership:** frontend, backend, database, and deployment workflow in one repo
- **Production-minded architecture:** containerized web/API/PostgreSQL stack with health checks and environment-based configuration
- **Strong UX fundamentals:** accessible route states, SEO assets, form validation, and resilient error handling
- **Operational maturity:** database migrations, seed data, deployment docs, runbook, and launch checklist
- **Quality built in:** ESLint, Vitest, Playwright, and Go tests to support reliable changes

## Tech stack

- **Frontend:** Vite, React, TypeScript, Tailwind CSS, React Router, React Hook Form, Zod, Framer Motion
- **Backend:** Go, Chi, PostgreSQL, pgx
- **Tooling:** Docker, Docker Compose, ESLint, Vitest, Playwright

## Local setup

1. `docker compose up -d postgres`
2. `cd api && go run ./cmd/migrate && go run ./cmd/seed`
3. `cd web && npm ci`
4. `cd web && npm run lint && npm run test && npm run build`
5. Optional full-stack run: `docker compose --profile stack up --build`

## Project docs

- `docs/deployment.md` - deployment topology and environment contract
- `docs/runbook.md` - day-to-day operations and release workflow
- `docs/launch-checklist.md` - reusable launch verification steps

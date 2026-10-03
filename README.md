# Patrick Fanella portfolio

The source for [patrickfanella.co](https://patrickfanella.co), my portfolio. The main pages show a short list of case studies and tools. Older and smaller projects sit in a `noindex` archive linked only from the footer.

The application is a React frontend, a Go API, a PostgreSQL content layer, generated static route documents and an Nginx production image. Every project carries a delivery status, and copy must not describe pre-alpha or in-development work as production-ready. Project copy lives in `db/seed/portfolio.json`.

## Reliability and privacy contract

- sitemap routes have generated static documents and a failing route-contract check
- production-shaped Playwright tests run through the Nginx image, not Vite fallback routing
- axe and keyboard-dialog checks cover the primary journey
- mobile Lighthouse budgets enforce performance, accessibility, best practices, SEO, and CLS thresholds
- health responses expose only `status` and `databaseEnabled`
- successful contact responses do not echo stored submissions
- contact records are pruned after 90 days at startup and daily
- Plausible is the only supported analytics integration

## Tech stack

- **Frontend:** Vite, React, TypeScript, Tailwind CSS, React Router, React Hook Form, Zod, Framer Motion
- **Backend:** Go, Chi, PostgreSQL, pgx
- **Tooling:** Docker, Docker Compose, ESLint, Vitest, Playwright, axe, Lighthouse CI

## Local setup

The included `Makefile` automates the full bootstrap:

```bash
make bootstrap   # postgres + install + migrate + seed
make api         # run Go API (separate terminal)
make web         # run Vite frontend (separate terminal)
make verify      # lint + test + build
make verify-release # core verification + production E2E + Lighthouse budgets
```

Or step by step:

1. `docker compose up -d postgres`
2. `cd api && go run ./cmd/migrate && go run ./cmd/seed`
3. `cd web && npm ci`
4. `cd web && npm run lint && npm run test && npm run build`
5. Optional full-stack run: `docker compose --profile stack up --build`

Run `make help` to see all available targets.

## Project docs

- `docs/deployment.md` - deployment topology and environment contract
- `docs/runbook.md` - day-to-day operations and release workflow
- `docs/launch-checklist.md` - reusable launch verification steps

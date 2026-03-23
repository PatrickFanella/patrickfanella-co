# Operator runbook

This runbook is the day-to-day reference for setting up, verifying, releasing, and recovering the Patrick Fanella portfolio stack.

## 1. Local bootstrap

### Prerequisites

- Docker with Compose support
- Go `1.23.x`
- Node `22.x` or later

### Initial setup

1. copy `.env.example` to `.env`
2. review the local defaults
3. start PostgreSQL

```text
cp .env.example .env
docker compose up -d postgres
cd api && go run ./cmd/migrate
cd api && go run ./cmd/seed
cd web && npm install
```

### Local development

```text
cd api && go run ./cmd/server
cd web && npm run dev
```

## 2. Representative full-stack container run

Use this before release work when you want the local environment to resemble deployment more closely:

```text
docker compose --profile stack up --build
```

Expected endpoints:

- web: `http://localhost:4173`
- api: `http://localhost:8181`
- postgres: `localhost:5432`

## 3. Database updates

### Apply migrations

```text
cd api && go run ./cmd/migrate
```

Run this before deploying API changes that depend on new schema.

### Refresh curated content

Source of truth:

- `db/seed/portfolio.json`

Refresh command:

```text
cd api && go run ./cmd/seed
```

When content changes:

1. update `db/seed/portfolio.json`
2. make sure any referenced media assets exist under `web/public/assets/projects/`
3. rerun the seed command
4. rebuild the web app if SEO or route data changed

## 4. Verification commands

Run these before release or after notable changes:

```text
cd api && go test ./...
cd web && npm run lint
cd web && npm run test
cd web && npm run build
cd web && npm run test:e2e
```

## 5. Observability and health

### API health endpoint

`GET /api/health` now reports:

- overall service status (`ok` or `degraded`)
- database availability
- notification integration enablement
- API uptime
- request and error counters
- contact submission count
- notification failure count

### Log expectations

The API writes structured JSON logs to stdout.

Key events:

- `http.request`
- `projects.list failed`
- `projects.detail failed`
- `contact.create stored`
- `contact.create notification_sent`
- `contact.create notification_failed`

These logs are intentionally privacy-aware and avoid writing the full contact message body.

### Web health endpoint

The Nginx web container serves `GET /healthz` for uptime checks.

## 6. Contact notifications

Optional webhook notifications are controlled by:

- `CONTACT_NOTIFICATION_WEBHOOK_URL`
- `CONTACT_NOTIFICATION_BEARER_TOKEN`
- `CONTACT_NOTIFICATION_TIMEOUT_SECONDS`

Behavior:

- contact messages are stored in PostgreSQL first
- if a webhook is configured, the API posts sender metadata plus a short message preview
- webhook failure does **not** fail the visitor-facing request, but it is counted and logged

If notifications stop arriving:

1. check `GET /api/health` for `notificationsEnabled`
2. inspect API logs for `contact.create notification_failed`
3. verify the webhook URL and token in the production secret store

## 7. Privacy-safe analytics

Analytics are disabled by default.

Enable them by setting:

- `VITE_ANALYTICS_PLAUSIBLE_DOMAIN`
- optionally `VITE_ANALYTICS_PLAUSIBLE_SCRIPT_URL` if self-hosting Plausible

Tracked events:

- SPA page views
- outbound link clicks

No invasive session replay or cross-site behavioral tracking is included in this baseline.

## 8. Release flow

1. confirm `.env.example`, deployment docs, and any new runtime variables are current
2. run migrations
3. run seed if content changed
4. build and deploy the API image
5. build and deploy the web image with the correct `VITE_*` values
6. execute `docs/launch-checklist.md`
7. watch logs and health endpoints during the first verification pass

## 9. Rollback approach

### Application rollback

If a deploy causes regressions:

1. redeploy the previous known-good `api` image
2. redeploy the previous known-good `web` image
3. confirm `/api/health` and `/healthz` recover
4. re-run the smoke path and a manual contact submission

### Data rollback

- avoid destructive schema changes without a backup plan
- take a managed PostgreSQL backup or snapshot before risky migrations
- if a migration introduces a release blocker, restore the backup or apply the corrective down-path before redeploying

## 10. Common failure checks

### `databaseEnabled: false`

- verify `DATABASE_URL`
- confirm the database host is reachable from the API runtime
- check whether migrations were applied

### contact form returns `503`

- health endpoint likely shows degraded DB state
- inspect API logs for `contact.create database_unavailable`

### contact form succeeds but no notification arrives

- visitor request should still return `201`
- inspect logs for `contact.create notification_failed`
- verify the webhook endpoint accepts JSON POST requests

### analytics script does not load

- confirm `VITE_ANALYTICS_PLAUSIBLE_DOMAIN` was set during the web build
- verify any CSP or reverse proxy rules allow the configured script URL

## 11. Reference docs

- `docs/deployment.md`
- `docs/launch-checklist.md`
- `README.md`

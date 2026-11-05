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

For site content changes:

1. update `db/seed/portfolio.json`
2. make sure referenced media assets exist under `web/public/assets/projects/`
3. build and verify the web app
4. merge to `main`; CI deploys the web image and catalog after verification

The web app reads `/content/projects.json`, prepared before development/build.
It does not need a production reseed. The seed command above updates only the
legacy database-backed `/api/projects` endpoints; use the backup procedure in
`docs/deployment.md` before changing production database contents.

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

Email notifications use these API-only settings:

- `CONTACT_NOTIFICATION_EMAIL_API_KEY`: Brevo transactional key
- `CONTACT_NOTIFICATION_EMAIL_FROM`: verified `alerts@subcult.tv` sender
- `CONTACT_NOTIFICATION_EMAIL_TO`: fixed `patrick@subcult.tv` recipient
- `CONTACT_NOTIFICATION_TIMEOUT_SECONDS`: provider timeout, default five seconds

Optional ntfy and n8n targets remain available through
`CONTACT_NOTIFICATION_NTFY_URL`, `CONTACT_NOTIFICATION_NTFY_TOKEN` and
`CONTACT_NOTIFICATION_N8N_URL`.

The API stores the contact message before notifying. Email includes the full
message and sets Reply-To to the validated visitor address. A provider failure
is counted and logged without the message, API key or provider response body.
The visitor still receives a saved-message confirmation; that response does not
promise mail delivery. There is no background retry queue.

If email stops arriving, inspect `contact.create notification_failed` and the
`email` notifier result, then check the host-only key, verified sender and Brevo
transactional delivery records. Never paste resolved Compose settings or provider
bodies into CI, issues or logs. Database pruning does not delete inbox copies.

## 7. Privacy-safe analytics

Analytics are disabled by default.

Enable them by setting:

- `VITE_ANALYTICS_PLAUSIBLE_DOMAIN`
- optionally `VITE_ANALYTICS_PLAUSIBLE_SCRIPT_URL` if self-hosting Plausible

Tracked events:

- SPA page views
- outbound link clicks

No invasive session replay or cross-site behavioral tracking is included in this baseline.

Contact records are retained for 90 days by default. The API prunes expired rows at startup and daily and logs only deletion counts. Portfolio database dumps are kept in the exact Almaz portfolio-backup directory and removed after 90 days by the dedicated weekly timer.

## 8. Release flow

Site UI/content and schema-compatible API changes deploy automatically after
successful verification on a `main` push. CI activates both application images,
then checks public HTML, the exact project catalog and API database health.
The app's NUC fleet-deploy profile retains the live runtime configuration and
private email settings. It does not update PostgreSQL, run migrations or seed.

For a schema or production data change, follow the verified backup and migration
procedure in `docs/deployment.md` before deploying a dependent API build. A normal
portfolio content edit needs no database update.

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
- check the configured email provider, verified sender, recipient and delivery records
- check any separately enabled webhook endpoint accepts JSON POST requests

### analytics script does not load

- confirm `VITE_ANALYTICS_PLAUSIBLE_DOMAIN` was set during the web build
- verify any CSP or reverse proxy rules allow the configured script URL

## 11. Reference docs

- `docs/deployment.md`
- `docs/launch-checklist.md`
- `README.md`

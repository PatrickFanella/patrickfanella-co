# Deployment topology

Phase 5 standardizes on a lean production model that is realistic to maintain for a personal portfolio:

- **`web`**: static SPA build served by Nginx from the `web` container image
- **`api`**: Go HTTP server running as a single container process
- **`postgres`**: managed PostgreSQL in production, local Compose PostgreSQL for representative verification
- **secrets**: injected as environment variables by the container host; never baked into images

This repo now includes a representative full-stack Compose topology so the deployment story can be verified locally without inventing a separate platform-specific setup first.

## Runtime topology

### Production recommendation

Use one long-lived `production` environment only:

1. build and publish the `api` and `web` container images
2. deploy them to a small container host or PaaS that supports:
   - per-service environment variables / secrets
   - health checks
   - rolling or quick restarts
3. point the API at a managed PostgreSQL instance
4. terminate TLS at the hosting layer or reverse proxy

This keeps the stack small while still supporting uptime checks, logs, and reproducible releases.

### Representative local/staging topology

The root `docker-compose.yml` now supports:

- `postgres` by default for local development bootstrap
- `api` and `web` behind the `stack` profile for a production-shaped local run

Use this for smoke testing the release candidate:

```text
docker compose --profile stack up --build
```

Web is exposed on `http://localhost:4173`.
API is exposed on `http://localhost:8181`.
Health checks:

- web: `GET /healthz`
- api: `GET /api/health`

## Environment contract

### Required in production

| Variable | Service | Required | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | api | yes | Managed PostgreSQL connection string |
| `CORS_ORIGIN` | api | yes | Public web origin allowed to submit contact form |
| `VITE_API_BASE_URL` | web build | yes | Public API base URL used by the SPA |
| `VITE_SITE_URL` | web build | yes | Canonical public site URL used for SEO assets |

### Security and abuse controls

| Variable | Service | Default | Notes |
| --- | --- | --- | --- |
| `CONTACT_MAX_BODY_BYTES` | api | `16384` | Request body cap for contact submissions |
| `CONTACT_RATE_LIMIT_MAX_REQUESTS` | api | `5` | Per-IP submission cap |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | api | `60` | Rate-limit rolling window |
| `CONTACT_HONEYPOT_FIELD` | api | `website` | Hidden bot-trap field |
| `CONTACT_RETENTION_DAYS` | api | `90` | Active contact-record retention; pruning runs at startup and daily |

### Optional release integrations

| Variable | Service | Required | Notes |
| --- | --- | --- | --- |
| `CONTACT_NOTIFICATION_NTFY_URL` | api | optional | ntfy topic URL for push notifications (e.g. `https://ntfy.example.com/contact`) |
| `CONTACT_NOTIFICATION_NTFY_TOKEN` | api | optional | Bearer token for ntfy authentication |
| `CONTACT_NOTIFICATION_N8N_URL` | api | optional | n8n webhook trigger URL for workflow automation |
| `CONTACT_NOTIFICATION_TIMEOUT_SECONDS` | api | optional | Defaults to `5` |
| `VITE_ANALYTICS_PLAUSIBLE_DOMAIN` | web build | optional | Enables Plausible analytics when set |
| `VITE_ANALYTICS_PLAUSIBLE_SCRIPT_URL` | web build | optional | Override only when self-hosting Plausible |

## Secrets handling

- Keep local defaults in `.env` for development only.
- In production, inject secrets through the hosting provider’s secret store or per-service environment settings.
- Do **not** commit real database credentials, webhook URLs, or bearer tokens.
- Treat the webhook as sensitive because it can expose new-contact metadata.

## Migrations and seed flow

Launch and update flow:

1. apply database migrations before deploying a schema-dependent API build
2. run the seed command when curated portfolio content changes need to reach the database
3. deploy the API image
4. deploy the web image with the correct public env values
5. run the launch checklist in `docs/launch-checklist.md`

Recommended commands from the repo root:

```text
cd api && go run ./cmd/migrate
cd api && go run ./cmd/seed
```

## Smoke checks after deploy

Verify at minimum:

1. `GET /api/health` returns `200` with `databaseEnabled: true`
2. `GET /healthz` on the web container returns `200`
3. a representative contact submission returns only a confirmation message
4. if configured, the contact webhook receives a notification
5. the web app can browse home, projects, project detail, and contact routes without console or network failures

## Notes on analytics and notifications

- Analytics are **opt-in** and intentionally minimal: Plausible page views plus outbound-link tracking only. Do not enable a second browser telemetry product.
- Contact notifications support two targets simultaneously:
  - **ntfy**: push notification with title, priority, and 240-char message preview (set `CONTACT_NOTIFICATION_NTFY_URL`)
  - **n8n**: structured JSON webhook with full message body for workflow automation (set `CONTACT_NOTIFICATION_N8N_URL`)
- The database remains the source of truth for the full message body.

## Edge, backup, and immutable-release contract

The public Caddy route must serve web and API responses with a local-assets-first CSP, `nosniff`, a strict referrer policy, a restrictive permissions policy, frame protection, and HSTS. Start HSTS at `max-age=86400`; promote it to one year only after 24 hours of verified HTTPS operation. Cloudflare Browser Insights must remain disabled so Plausible is the sole analytics system.

Before a migration or reseed, create a custom-format PostgreSQL dump on Almaz, verify it with `pg_restore --list`, and copy the same verified file to the NUC rollback directory. Deploy only immutable `api:<commit-sha>` and `web:<commit-sha>` images built from a clean exact commit; record the previous image digests and Caddy configuration first. Production TLS currently terminates at Cloudflare, so the Caddy site address remains explicitly `http://` while Caddy supplies the application security headers returned through the edge.

## Automatic site delivery to the existing NUC

The native Gitea workflow retains API tests, web lint/tests/build, production-shaped
browser checks and mobile Lighthouse budgets. A frontend job directly depends
on those gates and builds/validates the exact image on PRs. Main pushes and manual
main dispatches deploy that image to the existing NUC `patrickfanella-web`,
Compose service `web`, through an app-specific restricted fleet-deploy key.

The build uses canonical `https://patrickfanella.co`, same-origin API requests
and an empty optional analytics domain. The retained live bundle had no analytics
loader URL; this deployment does not opt into a new tracker. The existing web
network, loopback port, healthcheck and runtime settings are captured in the
operator-owned frontend baseline. The web image includes `/content/projects.json`, generated from the versioned
portfolio source. Project pages load this same-origin catalog, so design and
content ship in one artifact. Contact submissions continue through the separately
hosted API/database. Caddy API routing remains on its existing configuration. No contact submission or
notification is sent as part of deployment verification.

Main-only secrets are guarded at step level. The receiver permits only the current
main and this site image, refuses runtime drift, checks image/configuration/health
and exact public HTML, and restores the prior image on failed readiness. Retries
reuse the accepted image. Exact image IDs, diagnostics and rollback commands stay
in private host receipts. Gitea stores only this app's `HOMELAB_DEPLOY_KEY` and
pinned `HOMELAB_KNOWN_HOSTS`; the homelab operator owns the key, initially due for
rotation February 3, 2027. Register/test its host profile before merging.

After rollout, CI compares public HTML with the accepted image and compares
`/content/projects.json` byte for byte with the catalog prepared from the checked-out
source. Catalog responses use `Cache-Control: no-store`. The build contract also
checks that the catalog is included in the web artifact. Check `/api/health`
separately. Database
migrations, reseeding and API cutover still require the verified backup and
immutable-release procedure above; a frontend rollback cannot undo schema changes.

### Content-only releases

Merge an update to `db/seed/portfolio.json` or its referenced public assets into
`main`. The `push` workflow runs verification first and deploys only if it passes.
`npm run dev` and `npm run build` both prepare the catalog automatically. The
catalog normalizes the same classification, status, and period defaults used by
the seed command and orders the featured work first. Generated catalog files are
not committed.

A web image rollback restores the previous catalog together with its UI and SEO
route documents. No database migration or reseed is needed for site content.
The legacy `/api/projects` endpoints still read PostgreSQL and can retain an older
selection; site pages do not use them. Updating those endpoints or the contact
backend uses the existing database/API release procedure.

# Launch readiness checklist

Use this checklist for the initial launch and future high-confidence updates.

## Environment and configuration

- [ ] production secrets are set for `DATABASE_URL`, `CORS_ORIGIN`, `VITE_API_BASE_URL`, and `VITE_SITE_URL`
- [ ] optional integrations are either intentionally disabled or configured (`CONTACT_NOTIFICATION_WEBHOOK_URL`, `VITE_ANALYTICS_PLAUSIBLE_DOMAIN`)
- [ ] `.env.example` matches the current runtime contract

## Database and content

- [ ] latest migrations applied successfully
- [ ] `db/seed/portfolio.json` content is reflected in the production database when needed
- [ ] referenced project media assets exist and load correctly
- [ ] a pre-release database backup or snapshot exists for rollback-sensitive changes

## Automated verification

- [ ] `cd api && go test ./...`
- [ ] `cd web && npm run lint`
- [ ] `cd web && npm run test`
- [ ] `cd web && npm run build`
- [ ] `cd web && npm run test:e2e`

## Health and observability

- [ ] `GET /api/health` returns `200`
- [ ] `databaseEnabled` is `true`
- [ ] `status` is `ok`
- [ ] `GET /healthz` for the web container returns `200`
- [ ] structured API logs are visible in the deployment runtime
- [ ] no unexpected `notification_failed`, `internal_error`, or startup errors appear during the verification window

## UX and content spot checks

- [ ] home page loads featured work without empty-state regressions
- [ ] projects archive and at least one project detail page load correctly
- [ ] contact form submits successfully against production
- [ ] tab order, focus treatment, and reduced-motion behavior look correct on key routes
- [ ] SEO basics are present: canonical tags, social image tags, `robots.txt`, and `sitemap.xml`
- [ ] 404 or missing-project behavior is still usable and intentional

## Notifications and analytics

- [ ] one manual contact submission produces a stored record
- [ ] if enabled, the contact webhook receives a notification with sender metadata and preview text
- [ ] if enabled, Plausible receives a page view and one outbound-link event

## Rollback notes

- [ ] previous known-good API and web image references are recorded
- [ ] rollback owner knows how to redeploy the previous release
- [ ] database recovery path (backup restore or corrective migration) is understood

## Release decision

- [ ] open blockers are documented explicitly
- [ ] deferred non-blockers are filed or noted for post-launch follow-up
- [ ] release is approved as **go** or stopped as **no-go** with a reason

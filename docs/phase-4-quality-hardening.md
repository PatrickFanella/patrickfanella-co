# Phase 4 — Quality hardening

This document captures the implementation and verification notes for roadmap issue #40 phase 4 (`#27` through `#32`).

## Scope covered

- shared route recovery states across the public frontend routes
- baseline accessibility improvements for navigation, async states, and form messaging
- baseline SEO/meta plumbing for core public routes and project detail pages
- contact endpoint abuse protection and privacy-minded defaults
- expanded automated test coverage across frontend, backend, and browser smoke paths

## Accessibility notes

### Implemented improvements

- `web/src/layout/SiteLayout.tsx`
  - preserves the skip link
  - moves focus to `#main-content` after route navigation so keyboard and assistive-tech users land on the new page content predictably
- `web/src/components/RouteState.tsx`
  - standardizes async/error/empty announcements with `role="status"` and `role="alert"` support
- `web/src/pages/ContactPage.tsx`
  - links validation errors to fields through `aria-describedby`
  - sets `aria-invalid` on invalid controls
  - keeps submission success/error messaging in live regions
- `web/src/pages/HomePage.tsx`
  - respects `prefers-reduced-motion` directly in the Framer Motion props rather than relying only on CSS timing overrides

### Manual verification checklist

Use this list during release verification:

1. Tab from the browser chrome into the page and confirm the skip link becomes visible.
2. Activate the skip link and confirm focus lands in the main content region.
3. Navigate between `Home`, `Projects`, and `Contact` with the keyboard only and confirm focus remains visible.
4. Submit the contact form with missing/invalid fields and confirm each invalid field has a linked error message.
5. Trigger a route-level loading or error state and confirm the message is announced through a status/alert region.
6. Enable reduced motion in the OS/browser and confirm the home hero renders without meaningful animation.

## Contact endpoint security posture

`api/internal/handlers/api.go` now enforces the following baseline protections for `POST /api/contact`:

- explicit origin check against `CORS_ORIGIN` when an `Origin` header is present
- JSON-only request enforcement (`Content-Type: application/json`)
- request body size cap via `CONTACT_MAX_BODY_BYTES`
- in-memory per-IP rate limiting via `CONTACT_RATE_LIMIT_MAX_REQUESTS` and `CONTACT_RATE_LIMIT_WINDOW_SECONDS`
- honeypot suppression using the hidden `website` field (`CONTACT_HONEYPOT_FIELD` documents the expected field name)
- privacy-minded logging that records rejection reasons without logging request bodies

### Runtime knobs

These values now live in both `.env` and `.env.example`:

- `CONTACT_MAX_BODY_BYTES`
- `CONTACT_RATE_LIMIT_MAX_REQUESTS`
- `CONTACT_RATE_LIMIT_WINDOW_SECONDS`
- `CONTACT_HONEYPOT_FIELD`

## SEO and metadata defaults

### Where metadata lives

- `web/src/components/Seo.tsx` — shared route-level title, description, Open Graph, Twitter, canonical, and JSON-LD handling
- `web/src/lib/site.ts` — site URL helpers
- `web/index.html` — static fallback metadata for the shell document

### Sitemap and robots generation

- `web/scripts/generate-sitemap.mjs` reads `db/seed/portfolio.json`
- the build script regenerates `web/public/sitemap.xml` and `web/public/robots.txt`
- the generator uses `VITE_SITE_URL` when available and falls back to `https://patrickfanella.co`

If the canonical production domain changes, update `VITE_SITE_URL` before building.

## Verification commands

Recommended verification order:

1. `cd api && go test ./...`
2. `cd web && npm run lint && npm run test && npm run build`
3. `cd web && npm run test:e2e`

## Notes for future work

- The current metadata system is client-rendered because the app is a Vite SPA. It provides maintainable route metadata and social tags for the current setup, but server-side rendering or prerendering would improve crawler/social-preview reliability further if that becomes a launch requirement.
- The contact rate limiter is intentionally lightweight and in-memory for v1. If abuse patterns appear in production, move the limit state to shared infrastructure.

# Frontend workspace

The portfolio frontend is a Vite + React + TypeScript app.

## Runtime API configuration

- `VITE_API_BASE_URL` is read from the workspace root `.env` because `vite.config.ts` sets `envDir: '..'`.
- If the variable is omitted, the frontend falls back to `http://localhost:8181` for local development.

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

- `npm run dev`: start the frontend dev server
- `npm run build`: type-check and build the frontend
- `npm run lint`: run ESLint
- `npm run test`: run frontend unit tests
- `npm run test:e2e`: run the Playwright smoke path against the seeded local stack

## Social cards

The four 1200x630 PNGs in `public/assets/social/` are drawn by `scripts/generate-social-cards.mjs`. It writes one SVG per card and converts it with `rsvg-convert` (librsvg).

- `npm run social:cards`: redraw the cards in place
- `npm run social:cards -- --out /tmp/cards`: draw them somewhere else, to compare before replacing anything

The script needs `rsvg-convert`, `fc-list` and three installed fonts: Liberation Sans Bold (title), the Inter variable font (detail line) and JetBrainsMono Nerd Font in Regular and Bold (eyebrow and footer). It finds those files by exact family name and renders through a private fontconfig that holds only them, so host font aliases cannot substitute another face. A missing font stops the run with an error.

The title face is Liberation Sans because the first cards were drawn on a machine without Space Grotesk, where the `Arial` fallback resolved to it. With the pinned fonts and librsvg 2.62.3, the script reproduced the cards committed in August byte for byte.

Card text: the default card carries the home page headline, set in the script. Each project card takes its title and the first sentence of its summary from `db/seed/portfolio.json`. Detail text longer than one line wraps to two. After changing the headline or a flagship summary, rerun the command, open every PNG, and commit the images with the text change.

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

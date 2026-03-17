# Patrick Fanella Portfolio — Implementation Plan

## Product direction

Build a **project-first developer portfolio** with a restrained retro-tactile visual language: editorial typography, subtle paper/cardboard texture, artifact-style project cards, and minimal but confident motion.

The site should present Patrick as a thoughtful **full stack developer** whose strongest story comes from shipped projects rather than traditional work history.

## Goals

- Present a polished, professional first impression
- Make projects the primary focus of the site
- Ship a simple but real full-stack architecture
- Keep scope tight enough to launch quickly
- Leave room for iterative upgrades later

## Core pages

### `/`

Landing page with:

- Hero and positioning statement
- Featured projects
- Technical strengths
- Short about/process section
- Contact call-to-action

### `/projects`

Portfolio index page with:

- Project cards
- Stack/category labels
- Featured and archived work sections

### `/projects/:slug`

Case study page with:

- Summary
- Problem and goals
- Stack and role
- Architecture highlights
- Screenshots/demo links
- Lessons learned

### `/contact`

Contact page with:

- Name, email, message
- Validation and success/error states
- Social/contact links

## Visual system

### Tone

- Warm off-white / charcoal / muted accent palette
- Tactile but restrained surface treatment
- Clean grid and confident whitespace
- Mono utility labels paired with editorial headings

### Signature details

- Artifact-like project cards
- Section labels that feel cataloged/archival
- Subtle hover lift and reveal states
- Motion always respecting `prefers-reduced-motion`

## Technical stack

### Frontend

- Vite
- React
- TypeScript
- React Router
- Tailwind CSS
- React Hook Form
- Zod
- Framer Motion

### Backend

- Go
- Chi router
- pgx / PostgreSQL

### Database

- PostgreSQL for contact submissions and later project content

## Repository structure

- `web/` — Vite + React frontend
- `api/` — Go API
- `db/migrations/` — SQL schema migrations
- `docs/` — project and content planning

## Initial milestones

### Milestone 1 — project scaffold

- Create frontend app shell
- Create Go API shell
- Add env templates
- Add initial documentation

### Milestone 2 — frontend foundation

- Create layout, routes, and shared UI primitives
- Implement home, projects, project detail, and contact pages
- Add visual tokens and initial styling system

### Milestone 3 — backend foundation

- Add health route
- Add projects endpoints scaffold
- Add contact submission endpoint scaffold
- Add PostgreSQL connection layer and initial schema

### Milestone 4 — integration

- Connect frontend to API
- Connect contact form submission flow
- Replace placeholder content with curated project content

### Milestone 5 — polish and deploy

- Accessibility pass
- Responsive polish
- SEO/meta setup
- Deployment of frontend, API, and database

## Initial database schema

### `projects`

- `id`
- `slug`
- `title`
- `summary`
- `description`
- `role`
- `year`
- `repo_url`
- `live_url`
- `featured`
- `sort_order`
- `created_at`

### `project_tags`

- `id`
- `name`

### `project_tag_map`

- `project_id`
- `tag_id`

### `contact_messages`

- `id`
- `name`
- `email`
- `message`
- `created_at`

## Acceptance criteria for v1

- The home page explains who Patrick is quickly and clearly
- The projects section is the primary focus of the site
- The contact form works end-to-end
- The codebase has a clean split between frontend and backend
- PostgreSQL is scaffolded and ready for local development
- The UI feels distinctive without becoming gimmicky
- The site is responsive and accessible at a baseline professional level

## Next implementation move

Start by scaffolding:

1. `web/` with Vite + React + TypeScript
2. `api/` with Go + Chi
3. root `.env` and `.env.example`
4. initial route/page structure
5. initial DB migration and local Postgres setup

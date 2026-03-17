# Phase 3 content inventory

Phase 3 stays on **seed data** for now. The richer fields live in `db/seed/portfolio.json`, and the frontend renders them through the expanded API contract.

The current seeded text is intentionally **placeholder content**. It is meant to validate field shape, layout density, and fallback behavior without pretending the launch copy is finished.

## What is implemented now

- Seed-backed project fields for:
  - `highlights`
  - `architecture`
  - `lessons`
  - `media[]` with `src`, `alt`, and optional `caption`
- Placeholder project visuals stored in `web/public/assets/projects/`
- Frontend fallback asset handling via `ProjectMediaGallery`
- Seed entries populated with placeholder summaries, highlights, architecture notes, and lessons
- Route copy can evolve separately from the seed content once final messaging is ready

## Asset conventions

- Store case-study visuals under `web/public/assets/projects/`
- Reference them from `db/seed/portfolio.json` using web paths like `/assets/projects/<file>.svg`
- Preferred launch replacement format: optimized `.webp` screenshots or polished static exports
- Keep every media item paired with:
  - descriptive `alt` text
  - a short caption explaining what the viewer is seeing

## Production assets still needed

### Site-level

- Final social preview image for the portfolio homepage
- Resume PDF or equivalent downloadable profile asset if that becomes a supported contact path
- Optional headshot or portrait only if it supports the project-first story (not required for current direction)

### Project assets by case study

#### `patrickfanella-co`

- Homepage or hero composition screenshot
- Project detail route screenshot
- Contact route screenshot or API/data-flow diagram
- Optional architecture diagram showing React ↔ Go ↔ PostgreSQL flow

#### `mern-memories`

- Authenticated dashboard or post index screenshot
- Post editor / create-memory screenshot
- Optional mobile crop if responsive behavior is worth highlighting

#### `yelpcamp`

- Campground index or listing grid screenshot
- Campground detail page screenshot with map/media visible
- Review or authoring flow screenshot

#### `unique-id-rotating-logger`

- CLI/log output screenshot
- Rotation or archive directory visual
- Optional README/code snippet graphic if there is no UI surface worth capturing

## Copy still needed for a fully polished launch

### Home route

- Final hero line and supporting sentence after Patrick confirms preferred positioning
- Optional short bio line about current role target or collaboration preference

### Projects route

- Final intro sentence once the launch set is frozen
- Any project-specific outcome metrics worth surfacing on cards later

### Project detail routes

For each seeded project, tighten:

- `summary` to a final one-sentence positioning statement
- `description` to a final narrative paragraph
- `highlights` to outcome-focused bullets
- `architecture` to system-level choices worth discussing in interviews
- `lessons` to concrete takeaways rather than general reflections
- `media[].caption` to accurately describe the final image being shown

### Contact route

- Final preferred outreach copy
- Confirmed external links beyond GitHub/source (for example LinkedIn, résumé, direct email) before publishing them publicly

## Recommended next content pass

1. Replace placeholder seed copy with real project-specific text when ready.
2. Replace SVG placeholders with final screenshots or diagrams.
3. Confirm public contact methods Patrick wants visible beyond the form.
4. Re-run the seed command and browser smoke checks after every content batch.

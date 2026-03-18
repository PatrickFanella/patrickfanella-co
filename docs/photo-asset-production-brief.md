# Photo Asset Production Brief

Last updated: 2026-03-18
Project: `patrickfanella-co`

## Objective

Produce all image assets required for launch-ready browser icons, social sharing (Open Graph + Twitter/X), and project case-study media.

This brief includes:

- **Current-contract assets** (must match current code/seed references)
- **Recommended launch assets** (browser compatibility + social quality)
- **Project media shot list** (all current projects)
- **Export specs + QA checklist**

---

## Current implementation contract (already wired)

The app currently references these paths:

- Favicon: `/favicon.svg`
- Default social image (OG + Twitter): `/assets/projects/project-fallback.svg`
- Project media: `/assets/projects/<slug>-overview.svg` from `db/seed/portfolio.json`

If filenames/paths change, frontend and/or seed references must be updated.

---

## Deliverables by priority

### [P0] Required now (to satisfy current references)

Deliver these files in `web/public/assets/projects/`:

1. `clpr-overview.svg`
2. `subcorp-overview.svg`
3. `transcript-create-overview.svg`
4. `clustr-overview.svg`
5. `internet-id-overview.svg`
6. `soundhash-overview.svg`
7. `jury-rigged-overview.svg`
8. `patchwork-overview.svg`

Notes:

- `project-fallback.svg` already exists and remains the fallback/default share image.
- `favicon.svg` already exists.

### [P1] Recommended launch set (browser + social completeness)

Deliver these in `web/public/`:

- `favicon.ico` (multi-size ICO including 16, 32, 48)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

Recommended social images:

- `social-default-1200x630.png` (homepage/default OG + Twitter large card)
- `social-default-1200x630.webp` (optional modern format companion)

### [P2] Full case-study coverage (recommended next)

Add media for projects currently missing visuals in seed data:

- `galdr-overview.svg`
- `cutroom-overview.svg`
- `subcults-overview.svg`

Optional: create per-project social cards (1200x630) for richer sharing.

---

## Technical specifications

### 1) Favicon + app icons

- Color space: **sRGB**
- Background handling: transparent where appropriate
- Primary source: vector master (SVG)
- Export sharpness: optimized for small sizes (16–32 px legibility)

### 2) Social cards (Open Graph + Twitter/X)

- Target size: **1200x630** (aspect ratio $1.91:1$)
- Safe text zone: keep critical text/logos in central ~80%
- Preferred format: PNG (primary), WebP optional
- Max file size target: under 500 KB (ideal under 300 KB)

### 3) Project case-study media

- UI display ratio in app: **16:10**
- Recommended export size: **1600x1000** (or 1920x1200)
- Preferred format for photo/raster artwork: WebP or PNG
- If keeping current `.svg` contract: provide SVG illustrations/diagrams at equivalent visual fidelity
- Max file size target: under 600 KB each (ideal under 350 KB)

### 4) Naming rules

- Lowercase
- Hyphen-separated
- No spaces
- Keep slug alignment with project route name

Examples:

- `transcript-create-overview.svg`
- `social-default-1200x630.png`

---

## Creative direction (fast guidance)

Visual style should match the site tone: bold, technical, high-contrast, product-focused.

Per asset category:

- **Favicon/icons**: minimal, high-contrast mark; must read at 16x16.
- **Social cards**: project-first and identity-forward; include name/title hierarchy, avoid dense paragraphs.
- **Project media**: one clear “what this system is” frame per project (architecture, UI, pipeline, or real product screenshot).

---

## Project media shot list

Use one primary visual per project minimum.

| Project slug | File name | Suggested visual |
| --- | --- | --- |
| `clpr` | `clpr-overview.svg` | Platform architecture: API + web + mobile + search stack |
| `subcorp` | `subcorp-overview.svg` | Multi-agent WebSocket chat + sandbox tooling system map |
| `transcript-create` | `transcript-create-overview.svg` | Ingestion → Whisper GPU → diarization → searchable transcript flow |
| `clustr` | `clustr-overview.svg` | 3D/2D graph network visualization with Louvain clustering |
| `internet-id` | `internet-id-overview.svg` | Content hash → IPFS → on-chain registration → verification |
| `soundhash` | `soundhash-overview.svg` | Audio fingerprint extraction + matching pipeline |
| `jury-rigged` | `jury-rigged-overview.svg` | Ace Attorney-style courtroom interface + live audience interaction |
| `patchwork` | `patchwork-overview.svg` | Map-based discovery with geoprivacy indicators |
| `galdr` | `galdr-overview.svg` | Customer health scoring dashboard + data sources |
| `cutroom` | `cutroom-overview.svg` | Multi-stage AI video production pipeline + timeline |
| `subcults` | `subcults-overview.svg` | Scene map + live audio + decentralized ingestion view |

---

## Delivery package format

Please deliver:

1. **Web-ready exports** at exact final filenames.
2. **Source files** (Figma/PSD/AI) in a separate `source/` folder.
3. A short README with:
   - export date
   - font dependencies
   - any licensed stock/media notes

Suggested drop structure:

```text
assets-delivery/
  public/
    favicon.ico
    favicon-16x16.png
    favicon-32x32.png
    apple-touch-icon.png
    android-chrome-192x192.png
    android-chrome-512x512.png
    site.webmanifest
    assets/
      projects/
        clpr-overview.svg
        ...
  source/
    social-cards.fig
    project-media.fig
  README.md
```

---

## QA acceptance checklist

- [ ] Every required filename exists exactly as specified.
- [ ] Icons are crisp at 16x16 and 32x32.
- [ ] Social cards render cleanly at 1200x630 with no clipped text.
- [ ] Project media maintains 16:10 composition and avoids unreadable tiny text.
- [ ] All exports are in sRGB and within size targets.
- [ ] No broken paths when copied into `web/public`.

---

## Implementation notes for engineering

- Current metadata uses `%VITE_SITE_URL%/assets/projects/project-fallback.svg` for both OG and Twitter image.
- If the team decides to use raster social cards, update metadata/image paths in:
  - `web/index.html`
  - `web/src/components/Seo.tsx`
- If adding media for `galdr`, `cutroom`, and `subcults`, update `db/seed/portfolio.json` to include those `media` entries.

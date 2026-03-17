# Design System Spec: Dark Minimal Brutalist / Swiss Hybrid

## Conceptual Metaphor
The system mimics a high-contrast, technical database/terminal with a strong editorial structure rooted in Swiss design. It leans into raw edges, mechanical functionality, and explicit non-primary accenting while avoiding retro nostalgia (no blurs, no rounded shapes). It plays heavily with structural grid lines and brutalist interaction primitives.

## Palette
- **Primary Surface (Paper):** `#09090b` (near black).
- **Secondary Surface (Panel):** `#121214`.
- **Stroke / Borders:** `#3f3f46` for structure lines.
- **Accents:**
  - **Neon Green:** `#bef264` (Accent)
  - **Electric Purple:** `#c084fc` (Accent / Structural)
  - **Teal / Cyan:** `#5eead4` (Accent)
- **Ink:**
  - `var(--color-ink)`: Text primary, `#f4f4f5`
  - `var(--color-ink-pushed)`: `#e4e4e7`
  - `var(--color-ink-soft)`: `#a1a1aa`
  - `var(--color-ink-mute)`: `#71717a`

## Typography Structure
- **Display / Headers:** **Space Grotesk** (Uppercase, geometric).
- **Body / Interface:** **Inter** (Neutral, clean).
- **Functional / Meta:** **JetBrains Mono** (Uppercase, prominent letter spacing, representing system instructions/labels).

## Layout & Structure Constraints
- **Border Radius:** `0px` universally. No rounded corners.
- **Borders:** Component boundaries are delineated by heavy `border-2 border-stroke`.
- **Shadows:** Only hard, unblurred shadows for depth/elevation (`4px 4px 0 0 <color>`).
- **Texture:** The base screen uses a subtle radial dot grid (`bg-[radial-gradient(var(--color-stroke)_1px,transparent_1px)]`).
- **Grids:** Interfaces are pushed into robust visual boxes (e.g. `grid lg:grid-cols-2` side-by-side splits) that reinforce brutalist constraints.

## Component Specifics
- **Buttons / Actions (`primaryButtonClass`):**
  - **Hover:** Active element translates up & left (`-translate-x-[1px] -translate-y-[1px]`) and reveals a hard green brutalist shadow (`shadow-brutal-green`).
- **Section Labels:** Stark typography aligned with colored squares (e.g., `<span className="block h-3 w-3 bg-accent-purple" />`).
- **Cards / Containers (`surfaceCardClass`):**
  - Black paper with thick stroke boundaries.
  - Hover states often trigger `shadow-brutal-purple` and shift on the axes.

## Tone & Voice
Copywriting mimics stark interface logs, database queries, and raw transmissions. Words like `System topology`, `Database query`, `Execute request`, `Protocol` instead of "About me, "My work", "Submit".

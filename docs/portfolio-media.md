# Portfolio media

Studio owns the brand masters. The active source is
`subculture-collective/subcult-tv/studio`; the older `subcult-studio` checkout
has been incorporated into that repository. The selected source revision and
per-file SHA-256 hashes are recorded in `brand-asset-provenance.json`.
Unrelated source work was present during selection; none of it was copied.

## Selected assets and usage

- `patrick__eff` uses its approved lavender waveform (`01-lavender.svg`) in the
  site header. The existing poster/terminal palette and bold display style follow
  the owner's design preference. Space Grotesk, Inter and JetBrains Mono remain
  self-hosted through the existing Fontsource dependencies and their licenses.
- Product marks come from each Studio pack's approved primary/outlined selection.
  Logos sit on a pack-appropriate dark or light background without recoloring.
  They appear next to project names and in archive cards.
- Fourteen existing public product captures replace the older portfolio fixtures.
  Each has an unchanged wide WebP and a 720px derivative. These are refreshed
  portfolio assets, not a claim that a new capture or runtime qualification took
  place today. Patchwork and Tadooer captions retain development/demo boundaries.
- Super Productivity MCP uses a Studio overview illustration where a product
  capture would misrepresent its integration interfaces. Its caption identifies
  the illustration. Subsets uses its approved mark in the archive. Projects without approved marks or captures
  use original title covers; a cover is not presented as an application screenshot.

The manifest records the exact source and output paths, copy/transformation kind
and hashes. No entire pack, draft, private catalog, marketing plan or account
state enters the public asset directory. Selected source assets retain their
upstream licensing; Studio selection does not transfer trademark ownership.

To verify and rebuild this explicit selection, with Python and Pillow installed:

```sh
python3 web/scripts/sync-studio-assets.py /path/to/subcult-tv
```

The script rejects changed source hashes and changed destination bytes. Review
both the pack's current selection and a new manifest before adopting later art.
A hash refresh alone does not authorize a new public asset.

## Original diagrams

Six new SVG component-flow diagrams are authored here in
`web/scripts/generate-project-diagrams.py`. The nodes and edges follow the public
repository architecture notes reviewed for Clpr, HasanAra/Rekolekt, Undertow,
Tadooer, Patchwork and Super Productivity MCP. These are selected conceptual
paths, not traffic measurements, deployment maps or a product maturity claim.
They replace the old illustrated architecture/metrics assets in case-study data.
No performance or adoption figures are introduced.

Regenerate the diagrams and their catalog entries with:

```sh
python3 web/scripts/generate-project-diagrams.py
```

Review the SVGs at full size and on a narrow screen. The media dialog provides
an expanded view, captions remain visible, and alt text names the component path.
`npm run build --prefix web` checks that every referenced logo, thumbnail, capture
variant and diagram is present in the published artifact. The archive is part of
the main navigation and the Projects page links a preview into it; archive and
older-project search indexing remain disabled.

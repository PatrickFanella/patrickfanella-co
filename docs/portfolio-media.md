# Portfolio media

The November 5, 2026 selection contains 20 browser screenshots captured during
this task, 37 explicit Studio assets, and 25 source-authored component-flow
diagrams. No older screenshots are referenced by the published catalog.

## Browser captures

`screenshot-provenance.json` records the public URL, page title, UTC capture time,
browser viewport, original dimensions and hash, state notes, and export hashes.
The T3 Code shared browser used a 1440 × 900 CSS viewport; its screenshot export
is 1280 × 800. Each capture has 1280px and 640px WebP exports under a dated filename.
These are full-frame exports without fabricated interface elements.

The captures cover Clpr, HasanAra, Undertow, Chatty Cat, Commons, Headcount, Left
Field, Arkhiv, Backline, Kork, Patchwork, Prichal, Subcult OS, Subsets, and Arkhiv's
six collection frontends. Captions distinguish application interfaces from public
marketing pages, sample terminal output, local demonstrations, and previews.
Screenshots document the visible interface at capture time; they do not establish
product maturity or qualify every feature.

Tadooer's browser profile contained personal signed-in tasks, so no capture from
that session was imported. Its portfolio page uses approved branding and a fresh
workflow diagram. Native tools and projects without a suitable public interface
use approved marks, the existing Super Productivity MCP overview illustration,
or original title covers. Covers and illustrations are labeled as such.

## Studio assets

Studio owns the brand masters. The active source is
`subculture-collective/subcult-tv/studio`; the older `subcult-studio` checkout was
incorporated into that repository. This selection reads immutable revision
`a871aec9579c7e3119d3920fb499a06eb70313b8`.
`brand-asset-provenance.json` records each selected source path and hash, output
path and hash, viewBox, and usage. The existing local Studio checkout had unrelated
work; its dirty files were neither changed nor copied. Selected files were read
from the pinned Git revision.

The header uses the approved `patrick__eff` lavender waveform. Product marks use
their Studio pack's selected primary or outlined export on an appropriate dark or
light background, without recoloring. They appear in the gallery, detail pages,
collection cards, and archive. Space Grotesk, Inter, and JetBrains Mono remain
self-hosted through the existing Fontsource dependencies and licenses.

To verify and rebuild the explicit Studio selection, use a checkout or selected
file tree containing the pinned revision's bytes:

```sh
python3 web/scripts/sync-studio-assets.py /path/to/subcult-tv
```

The script refuses changed source or destination hashes. Review the pack's current
selection and a new manifest before adopting later art. No whole pack, draft,
private catalog, marketing plan, or account state is published. Selected assets
retain their upstream licensing and trademark ownership.

## Original diagrams

`web/scripts/generate-project-diagrams.py` authors a diagram for each of the 25
selected projects. This update adds 19 diagrams to the six written for the previous
portfolio update. Their nodes and edges follow the reviewed repository architecture
notes. They explain selected component paths; they are not traffic measurements,
deployment inventories, or product-readiness claims.

Regenerate the SVGs and their catalog entries with:

```sh
python3 web/scripts/generate-project-diagrams.py
```

Review the SVGs at full size and on a narrow screen. The media dialog provides an
expanded view; captions remain visible, and alt text names the component path.
`npm run build --prefix web` checks referenced logos, thumbnails, collection assets,
capture variants, diagrams, related-project targets, and generated detail routes.
It also rejects the removed project entries and their static documents.

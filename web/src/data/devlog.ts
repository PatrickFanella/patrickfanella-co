import type { DevlogPost } from '../lib/types'

export const devlogPosts: DevlogPost[] = [
  {
    id: '2026-05-26-archive-filters',
    date: '2026-05-26',
    title: 'Tuned archive filters to feel subtractive, not noisy',
    body: `Adjusted the Projects page so counts respond to the current selection instead of looking like totals.

- Counts now move with the active filter set.
- Directory rows regained a thumbnail column.
- The result is easier to skim in a hurry.`,
    tags: ['archive', 'filters', 'ux'],
    source: 'changemaker',
    projectRef: 'patrickfanella-co',
  },
  {
    id: '2026-05-25-detail-layouts',
    date: '2026-05-25',
    title: 'Split the project detail page into infographic + article modes',
    body: `The case-study page now has two reading modes.

> Infographic for recruiters skimming fast.

> Article for anyone who wants the longer story.

The same content powers both layouts so the page stays consistent without feeling repetitive.`,
    tags: ['case-study', 'layout', 'content'],
    source: 'changemaker',
    projectRef: 'clpr',
  },
  {
    id: '2026-05-24-editorial-theme',
    date: '2026-05-24',
    title: 'Swapped in a warmer editorial theme',
    body: `The site now leans darker and more editorial:

- brass accents
- serif display type
- softer surface contrast

It reads less like a SaaS dashboard and more like a curated portfolio.`,
    tags: ['theme', 'tokens', 'typography'],
    source: 'changemaker',
  },
  {
    id: '2026-05-23-horizons',
    date: '2026-05-23',
    title: 'Added a daily devlog feed stub',
    body: `Built the first pass of the daily feed that will ingest posts from Changemaker later.

The schema is intentionally boring: **id, date, title, body, tags, source, projectRef**.
That makes future ingestion and filtering a lot easier.`,
    tags: ['devlog', 'ingestion', 'schema'],
    source: 'changemaker',
    projectRef: 'subcorp',
  },
]

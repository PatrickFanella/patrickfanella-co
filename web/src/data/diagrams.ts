// Registry of standalone HTML diagrams shipped in /web/public/assets/diagrams/.
// Each entry renders as an <iframe>. Keep titles short — they label the figure.

export interface DiagramEntry {
  src: string
  title: string
  kind: 'architecture' | 'features' | 'metrics' | 'tech-stack' | 'flow' | 'overview'
  // Recommended aspect ratio (width / height) for the iframe shell.
  aspect?: number
}

// Per-project diagrams. Key = project slug.
export const projectDiagrams: Record<string, DiagramEntry[]> = {
  clpr: [
    { src: '/assets/diagrams/clpr-architecture.html', title: 'System architecture', kind: 'architecture', aspect: 760 / 700 },
    { src: '/assets/diagrams/clpr-features.html', title: 'Feature map', kind: 'features', aspect: 760 / 900 },
    { src: '/assets/diagrams/clpr-metrics.html', title: 'Metrics at a glance', kind: 'metrics', aspect: 760 / 520 },
    { src: '/assets/diagrams/clpr-tech-stack.html', title: 'Tech stack', kind: 'tech-stack', aspect: 760 / 480 },
  ],
  clustr: [
    { src: '/assets/diagrams/clustr-architecture.html', title: 'System architecture', kind: 'architecture', aspect: 760 / 760 },
    { src: '/assets/diagrams/clustr-features.html', title: 'Feature map', kind: 'features', aspect: 760 / 900 },
    { src: '/assets/diagrams/clustr-metrics.html', title: 'Metrics at a glance', kind: 'metrics', aspect: 760 / 560 },
    { src: '/assets/diagrams/clustr-tech-stack.html', title: 'Tech stack', kind: 'tech-stack', aspect: 760 / 480 },
  ],
  subcorp: [
    { src: '/assets/diagrams/subcorp-architecture.html', title: 'System architecture', kind: 'architecture', aspect: 760 / 800 },
    { src: '/assets/diagrams/subcorp-features.html', title: 'Feature map', kind: 'features', aspect: 760 / 900 },
    { src: '/assets/diagrams/subcorp-metrics.html', title: 'Metrics at a glance', kind: 'metrics', aspect: 760 / 560 },
    { src: '/assets/diagrams/subcorp-tech-stack.html', title: 'Tech stack', kind: 'tech-stack', aspect: 760 / 480 },
    { src: '/assets/diagrams/v04-agent-systems.html', title: 'Agent systems', kind: 'flow', aspect: 760 / 700 },
  ],
  'transcript-create': [
    { src: '/assets/diagrams/tc-architecture.html', title: 'System architecture', kind: 'architecture', aspect: 760 / 900 },
    { src: '/assets/diagrams/tc-features.html', title: 'Feature map', kind: 'features', aspect: 760 / 900 },
    { src: '/assets/diagrams/tc-metrics.html', title: 'Metrics at a glance', kind: 'metrics', aspect: 760 / 560 },
    { src: '/assets/diagrams/tc-tech-stack.html', title: 'Tech stack', kind: 'tech-stack', aspect: 760 / 480 },
  ],
  soundhash: [
    { src: '/assets/diagrams/v07-soundhash-pipeline.html', title: 'Audio fingerprint pipeline', kind: 'flow', aspect: 760 / 520 },
  ],
  'internet-id': [
    { src: '/assets/diagrams/v09-internet-id-flow.html', title: 'Identity flow', kind: 'flow', aspect: 760 / 560 },
  ],
  patchwork: [
    { src: '/assets/diagrams/v11-patchwork-arch.html', title: 'Patchwork architecture', kind: 'architecture', aspect: 760 / 540 },
  ],
  galdr: [
    { src: '/assets/diagrams/v12-galdr-scoring.html', title: 'Scoring model', kind: 'flow', aspect: 760 / 500 },
  ],
  subcults: [
    { src: '/assets/diagrams/v13-subcults-geo.html', title: 'Geo distribution', kind: 'flow', aspect: 760 / 540 },
  ],
}

// Cross-cutting diagrams that don't belong to a single project — surface on the home page.
export const crossCuttingDiagrams: DiagramEntry[] = [
  { src: '/assets/diagrams/v10-by-the-numbers.html', title: 'By the numbers', kind: 'overview', aspect: 760 / 420 },
  { src: '/assets/diagrams/v06-integration-map.html', title: 'Integration map', kind: 'overview', aspect: 760 / 420 },
  { src: '/assets/diagrams/v05-postgres-depth.html', title: 'Postgres depth', kind: 'architecture', aspect: 760 / 720 },
  { src: '/assets/diagrams/v16-realtime-patterns.html', title: 'Realtime patterns', kind: 'flow', aspect: 760 / 480 },
]

export function diagramsForProject(slug: string): DiagramEntry[] {
  return projectDiagrams[slug] ?? []
}

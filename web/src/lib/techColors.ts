export const pipColors = [
  'bg-accent-green',
  'bg-accent-teal',
  'bg-accent-purple',
  'bg-accent-yellow',
  'bg-accent-pink',
  'bg-accent-orange',
] as const

export const techPipColorMap: Record<string, string> = {
  Go: 'bg-accent-green',
  React: 'bg-accent-teal',
  'React Native': 'bg-accent-teal',
  'Three.js': 'bg-accent-teal',
  TailwindCSS: 'bg-accent-teal',
  TypeScript: 'bg-accent-purple',
  'Node.js': 'bg-accent-purple',
  Unity: 'bg-accent-purple',
  'C#': 'bg-accent-purple',
  Python: 'bg-accent-yellow',
  FastAPI: 'bg-accent-yellow',
  Whisper: 'bg-accent-yellow',
  PostgreSQL: 'bg-accent-pink',
  OpenSearch: 'bg-accent-pink',
  Redis: 'bg-accent-pink',
  Docker: 'bg-accent-orange',
  'AT Protocol': 'bg-accent-orange',
  'Multi-Agent Systems': 'bg-accent-green',
  MapLibre: 'bg-accent-green',
  LiveKit: 'bg-accent-orange',
}

export function getTechPipColor(tech: string): string {
  if (techPipColorMap[tech]) {
    return techPipColorMap[tech]
  }
  let hash = 0
  for (let i = 0; i < tech.length; i++) {
    hash = (hash << 5) - hash + tech.charCodeAt(i)
    hash |= 0
  }
  return pipColors[Math.abs(hash) % pipColors.length]
}

export const coreLegendTechs = [
  { name: 'Go', color: 'bg-accent-green' },
  { name: 'React', color: 'bg-accent-teal' },
  { name: 'TypeScript', color: 'bg-accent-purple' },
  { name: 'Python', color: 'bg-accent-yellow' },
  { name: 'PostgreSQL', color: 'bg-accent-pink' },
  { name: 'Docker', color: 'bg-accent-orange' },
]

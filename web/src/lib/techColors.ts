export const techColorMap: Record<string, string> = {
  // Flagship Core Technologies (28 unique colors with 0 collisions across all cards)
  Go: '#50fa7b',
  TypeScript: '#bd93f9',
  Python: '#f1fa8c',
  'C#': '#9333ea',
  React: '#8be9fd',
  'React Native': '#00d2ff',
  FastAPI: '#05df72',
  Whisper: '#2dd4bf',
  TailwindCSS: '#06b6d4',
  PostgreSQL: '#60a5fa',
  Redis: '#ff5555',
  OpenSearch: '#fb923c',
  PostGIS: '#22c55e',
  sqlc: '#a3e635',
  'Cloudflare R2': '#f59e0b',
  Docker: '#ffb86c',
  'AT Protocol': '#c084fc',
  Bluesky: '#0284c7',
  Jetstream: '#67e8f9',
  MapLibre: '#14b8a6',
  LiveKit: '#f97316',
  WebGL: '#ea580c',
  Unity: '#e2e8f0',
  'Graph Algorithms': '#d946ef',
  Playwright: '#f43f5e',
  Moderation: '#fbbf24',
  'Workflow Engine': '#7c3aed',
  Automation: '#ff79c6',

  // Additional Portfolio Technologies
  'Node.js': '#68a063',
  'Next.js': '#f8fafc',
  pgvector: '#818cf8',
  WebSocket: '#38bdf8',
  'AI Agents': '#f472b6',
  Express: '#eab308',
  SSE: '#a7f3d0',
  OpenRouter: '#ec4899',
  'Twitch API': '#9146ff',
  'Bubble Tea': '#f43f5e',
  Solidity: '#6366f1',
  IPFS: '#22d3ee',
  'Browser Extension': '#fb7185',
  Web3: '#a855f7',
  DSP: '#fb923c',
  'Audio Fingerprinting': '#e879f9',
  Stripe: '#635bff',
  HubSpot: '#ff7a59',
  Intercom: '#1f8eed',
  Prisma: '#16a34a',
  Remotion: '#f43f5e',
  ElevenLabs: '#e2e8f0',
  Ollama: '#f8fafc',
  Prometheus: '#e6522c',
  SQLite: '#38bdf8',
  SwiftUI: '#f05138',
  iOS: '#94a3b8',
  Vite: '#bd34fe',
  'Super Productivity': '#ff5555',
  Discord: '#5865f2',
  'yt-dlp': '#ff0000',
  Navidrome: '#00d2ff',
  'Three.js': '#00d2ff',
}

export function getTechColor(tech: string): string {
  if (techColorMap[tech]) {
    return techColorMap[tech]
  }
  let hash = 0
  for (let i = 0; i < tech.length; i++) {
    hash = (hash << 5) - hash + tech.charCodeAt(i)
    hash |= 0
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 85%, 65%)`
}

export function getTechPipColor(tech: string): string {
  return getTechColor(tech)
}

export const flagshipLegendTechs: Array<{ name: string; color: string }> = [
  { name: 'Go', color: '#50fa7b' },
  { name: 'TypeScript', color: '#bd93f9' },
  { name: 'Python', color: '#f1fa8c' },
  { name: 'C#', color: '#9333ea' },
  { name: 'React', color: '#8be9fd' },
  { name: 'React Native', color: '#00d2ff' },
  { name: 'FastAPI', color: '#05df72' },
  { name: 'Whisper', color: '#2dd4bf' },
  { name: 'TailwindCSS', color: '#06b6d4' },
  { name: 'PostgreSQL', color: '#60a5fa' },
  { name: 'Redis', color: '#ff5555' },
  { name: 'OpenSearch', color: '#fb923c' },
  { name: 'PostGIS', color: '#22c55e' },
  { name: 'sqlc', color: '#a3e635' },
  { name: 'Cloudflare R2', color: '#f59e0b' },
  { name: 'Docker', color: '#ffb86c' },
  { name: 'AT Protocol', color: '#c084fc' },
  { name: 'Bluesky', color: '#0284c7' },
  { name: 'Jetstream', color: '#67e8f9' },
  { name: 'MapLibre', color: '#14b8a6' },
  { name: 'LiveKit', color: '#f97316' },
  { name: 'WebGL', color: '#ea580c' },
  { name: 'Unity', color: '#e2e8f0' },
  { name: 'Graph Algorithms', color: '#d946ef' },
  { name: 'Playwright', color: '#f43f5e' },
  { name: 'Moderation', color: '#fbbf24' },
  { name: 'Workflow Engine', color: '#7c3aed' },
  { name: 'Automation', color: '#ff79c6' },
]

export const coreLegendTechs = flagshipLegendTechs

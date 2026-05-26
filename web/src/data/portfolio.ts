import portfolio from '../../../db/seed/portfolio.json'
import type { Project, Category, CuratedSet, CategoryId } from '../lib/types'

export const projects: Project[] = (portfolio as { projects: Project[] }).projects

export const projectsBySlug: Record<string, Project> = Object.fromEntries(
  projects.map((p) => [p.slug, p]),
)

export const categories: Category[] = [
  { id: 'web-apps', label: 'Web Applications', description: 'Product surfaces, dashboards, and full-stack apps.' },
  { id: 'ai-agents', label: 'AI / Agent Systems', description: 'LLM workflows, agents, automation, evaluation, orchestration.' },
  { id: 'tools', label: 'Developer Tools', description: 'CLI tools, plugins, config packages, extensions, reusable utilities.' },
  { id: 'infrastructure', label: 'Infrastructure / Self-Hosting', description: 'Docker, monitoring, deployment, observability, homelab-related tooling.' },
  { id: 'streaming', label: 'Media / Streaming', description: 'Twitch, content tools, clips, overlays, automation, creator workflows.' },
  { id: 'experiments', label: 'Experiments', description: 'Smaller prototypes, visual systems, speculative or unfinished work.' },
]

// Category inference from slug + stack + content (deterministic, no DB col exists).
const categoryHints: Record<CategoryId, RegExp[]> = {
  'ai-agents': [/agent|llm|llama|transcript|cutroom|edda|paqr|augr|galdr|open-pilot|super-productivity-mcp|artemis/i],
  streaming: [/clpr|subcorp|subcults|patchwork|jury-rigged|vod-tender|discord/i],
  infrastructure: [/llama-line|ocq|infra|docker|kubernetes|self-host/i],
  tools: [/tmux-popups|super-productivity-mcp|ocq|patrickfanella-co|artemis|discord-spywatcher|vod-tender/i],
  'web-apps': [/clpr|subcorp|patrickfanella-co|clustr|internet-id|soundhash/i],
  experiments: [/soundhash|clustr|internet-id/i],
}

export function categoriesForProject(p: Project): CategoryId[] {
  const ids: CategoryId[] = []
  for (const [id, patterns] of Object.entries(categoryHints) as [CategoryId, RegExp[]][]) {
    if (patterns.some((re) => re.test(p.slug) || re.test(p.title) || p.stack.some((s) => re.test(s)))) {
      ids.push(id)
    }
  }
  if (p.kind === 'tool' && !ids.includes('tools')) ids.push('tools')
  if (ids.length === 0) ids.push('web-apps')
  return Array.from(new Set(ids))
}

// Curated editorial sets per spec section 6.
export const curatedSets: CuratedSet[] = [
  {
    id: 'featured-systems',
    label: 'Featured Systems',
    purpose: 'Best overall product and system work.',
    takeaway: 'This person can build complete, deployed systems.',
    slugs: ['clpr', 'subcorp', 'transcript-create', 'clustr', 'patchwork', 'galdr', 'cutroom'],
  },
  {
    id: 'ai-automation',
    label: 'AI & Automation',
    purpose: 'Modern technical depth and automation work.',
    takeaway: 'Comfort with LLMs, workflows, orchestration, and evaluation.',
    slugs: ['transcript-create', 'cutroom', 'edda', 'paqr', 'augr', 'galdr', 'open-pilot', 'llama-line', 'super-productivity-mcp'],
  },
  {
    id: 'devtools-infra',
    label: 'Dev Tools & Infrastructure',
    purpose: 'Practical engineering, DX, and operations.',
    takeaway: 'Strong tooling, infra, DX, and operations sense.',
    slugs: ['tmux-popups', 'ocq', 'artemis', 'discord-spywatcher', 'vod-tender', 'llama-line', 'super-productivity-mcp', 'patrickfanella-co'],
  },
]

// Top stack/tech for filter chips.
export const techFilters = ['React', 'TypeScript', 'Go', 'Python', 'PostgreSQL', 'Docker', 'LLMs']

export function projectMatchesTech(p: Project, tech: string): boolean {
  const t = tech.toLowerCase()
  if (t === 'llms') return p.stack.some((s) => /llm|openai|ollama|llama|gpt/i.test(s)) || /agent|llm/i.test(p.description)
  return p.stack.some((s) => s.toLowerCase().includes(t))
}

// Featured (hero) order: featured=true, then sortOrder.
export const featuredProjects: Project[] = [...projects]
  .filter((p) => p.featured)
  .sort((a, b) => a.sortOrder - b.sortOrder)

export const allProjectsSorted: Project[] = [...projects].sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  return a.sortOrder - b.sortOrder
})

export const toolProjects: Project[] = projects.filter((p) => p.kind === 'tool')

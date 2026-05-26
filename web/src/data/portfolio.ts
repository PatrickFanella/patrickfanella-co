import portfolio from '../../../db/seed/portfolio.json'
import type { CareerTheme, CareerThemeId, CuratedSet, CuratedSetId, Project } from '../lib/types'

export const projects: Project[] = (portfolio as { projects: Project[] }).projects

export const projectsBySlug: Record<string, Project> = Object.fromEntries(projects.map((project) => [project.slug, project]))

export const careerThemes: CareerTheme[] = [
  { id: 'backend-engineering', label: 'Backend Engineering', description: 'APIs, persistence, auth, worker systems, and service boundaries.' },
  { id: 'full-stack-apps', label: 'Full-Stack Apps', description: 'Product surfaces where frontend, backend, and delivery all ship together.' },
  { id: 'ai-ml-integration', label: 'AI / ML Integration', description: 'LLM orchestration, evaluation, agent systems, and model-backed workflows.' },
  { id: 'devops-infra', label: 'DevOps & Infra', description: 'Containers, deployments, observability, queues, and self-hosted operations.' },
  { id: 'developer-tooling', label: 'Developer Tooling', description: 'CLIs, plugins, automation utilities, and productivity surfaces.' },
  { id: 'data-pipelines', label: 'Data Pipelines', description: 'Ingestion, search, indexing, storage, and structured processing flows.' },
  { id: 'product-systems', label: 'Product Systems', description: 'Customer-facing products with workflows, billing, and growth surfaces.' },
  { id: 'community-platforms', label: 'Community Platforms', description: 'Social products, moderation, and networked user experiences.' },
  { id: 'security-identity', label: 'Security & Identity', description: 'Auth, provenance, permissions, trust, and verification systems.' },
  { id: 'media-workflows', label: 'Media Workflows', description: 'Video, audio, publishing, clipping, and creative production pipelines.' },
  { id: 'interactive-systems', label: 'Interactive Systems', description: 'Real-time simulation, 3D/2D visuals, and audience-facing experiences.' },
]

const projectThemesBySlug: Record<string, CareerThemeId[]> = {
  clpr: ['full-stack-apps', 'backend-engineering', 'data-pipelines', 'product-systems'],
  subcorp: ['ai-ml-integration', 'backend-engineering', 'devops-infra', 'product-systems'],
  'transcript-create': ['ai-ml-integration', 'data-pipelines', 'full-stack-apps', 'product-systems'],
  clustr: ['data-pipelines', 'backend-engineering', 'full-stack-apps', 'interactive-systems'],
  'internet-id': ['security-identity', 'full-stack-apps', 'developer-tooling'],
  soundhash: ['ai-ml-integration', 'data-pipelines', 'backend-engineering'],
  'jury-rigged': ['ai-ml-integration', 'interactive-systems', 'media-workflows', 'full-stack-apps'],
  patchwork: ['community-platforms', 'full-stack-apps', 'product-systems', 'devops-infra'],
  galdr: ['full-stack-apps', 'backend-engineering', 'product-systems', 'devops-infra'],
  cutroom: ['media-workflows', 'ai-ml-integration', 'full-stack-apps', 'product-systems'],
  subcults: ['community-platforms', 'full-stack-apps', 'devops-infra', 'product-systems'],
  augr: ['ai-ml-integration', 'backend-engineering', 'developer-tooling'],
  'llama-line': ['ai-ml-integration', 'backend-engineering', 'devops-infra'],
  'open-pilot': ['developer-tooling', 'devops-infra', 'ai-ml-integration'],
  edda: ['ai-ml-integration', 'developer-tooling', 'backend-engineering'],
  paqr: ['data-pipelines', 'ai-ml-integration', 'developer-tooling', 'full-stack-apps'],
  'tmux-popups': ['developer-tooling', 'devops-infra'],
  'super-productivity-mcp': ['developer-tooling', 'product-systems'],
  ocq: ['developer-tooling', 'ai-ml-integration'],
  'patrickfanella-co': ['developer-tooling', 'full-stack-apps', 'product-systems'],
  artemis: ['developer-tooling', 'ai-ml-integration'],
  'discord-spywatcher': ['developer-tooling', 'community-platforms', 'product-systems'],
  'vod-tender': ['media-workflows', 'devops-infra', 'full-stack-apps'],
}

export function themesForProject(project: Project): CareerThemeId[] {
  return projectThemesBySlug[project.slug] ?? fallbackThemesForProject(project)
}

function fallbackThemesForProject(project: Project): CareerThemeId[] {
  if (project.kind === 'tool') return ['developer-tooling']
  return ['full-stack-apps']
}

export function matchesTheme(project: Project, themeId: CareerThemeId): boolean {
  return themesForProject(project).includes(themeId)
}

export function themeLabel(themeId: CareerThemeId): string {
  return careerThemes.find((theme) => theme.id === themeId)?.label ?? themeId
}

export function themeDescription(themeId: CareerThemeId): string {
  return careerThemes.find((theme) => theme.id === themeId)?.description ?? ''
}

export function themeCounts(projectList: Project[] = projects): Record<CareerThemeId, number> {
  return careerThemes.reduce((acc, theme) => {
    acc[theme.id] = projectList.filter((project) => matchesTheme(project, theme.id)).length
    return acc
  }, {} as Record<CareerThemeId, number>)
}

export const curatedSets: CuratedSet[] = [
  {
    id: 'featured-systems',
    label: 'Featured',
    purpose: 'Representative product and systems work.',
    takeaway: 'A compact slice of shipped, production-grade work.',
    slugs: ['clpr', 'subcorp', 'transcript-create', 'clustr', 'galdr'],
  },
  {
    id: 'ai-automation',
    label: 'AI & Automation',
    purpose: 'Model-backed workflows, agents, and automations.',
    takeaway: 'Comfort with LLMs, orchestration, and production automation.',
    slugs: ['transcript-create', 'cutroom', 'edda', 'augr', 'llama-line'],
  },
  {
    id: 'devtools-infra',
    label: 'Dev Tools & Infrastructure',
    purpose: 'Tooling, infra, and operational systems.',
    takeaway: 'Strong DX, infra, and operations instincts.',
    slugs: ['tmux-popups', 'ocq', 'artemis', 'patrickfanella-co', 'super-productivity-mcp'],
  },
]

export function projectsForCuratedSet(setId: CuratedSetId): Project[] {
  const set = curatedSets.find((item) => item.id === setId)
  if (!set) return []
  return set.slugs
    .map((slug) => projectsBySlug[slug])
    .filter((project): project is Project => Boolean(project))
}

export function projectsForTheme(themeId: CareerThemeId): Project[] {
  return projects.filter((project) => matchesTheme(project, themeId))
}

export function searchableText(project: Project): string {
  return [
    project.title,
    project.summary,
    project.description,
    project.role,
    project.stack.join(' '),
    themesForProject(project).join(' '),
  ]
    .join(' ')
    .toLowerCase()
}

export function projectMatchesQuery(project: Project, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return searchableText(project).includes(q)
}

export function projectMatchesStack(project: Project, stackTerm: string): boolean {
  const term = stackTerm.trim().toLowerCase()
  if (!term) return true
  if (term === 'llms') {
    return project.stack.some((entry) => /llm|openai|ollama|llama|gpt/i.test(entry)) || /agent|llm/i.test(project.description)
  }
  return project.stack.some((entry) => entry.toLowerCase().includes(term))
}

export function relatedProjectsFor(project: Project, limit = 6): Project[] {
  const currentThemes = new Set(themesForProject(project))
  const currentStack = new Set(project.stack.map((entry) => entry.toLowerCase()))

  return [...projects]
    .filter((candidate) => candidate.slug !== project.slug)
    .map((candidate) => {
      const candidateThemes = themesForProject(candidate)
      const themeScore = candidateThemes.filter((theme) => currentThemes.has(theme)).length
      const stackScore = candidate.stack.reduce((score, entry) => score + (currentStack.has(entry.toLowerCase()) ? 1 : 0), 0)
      const featuredScore = candidate.featured ? 1 : 0
      const yearScore = candidate.year

      return { candidate, themeScore, stackScore, featuredScore, yearScore }
    })
    .sort((a, b) => {
      if (b.themeScore !== a.themeScore) return b.themeScore - a.themeScore
      if (b.stackScore !== a.stackScore) return b.stackScore - a.stackScore
      if (b.featuredScore !== a.featuredScore) return b.featuredScore - a.featuredScore
      return b.yearScore - a.yearScore
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

export function relatedProjectsByTheme(project: Project, themeId: CareerThemeId, limit = 4): Project[] {
  return projects
    .filter((candidate) => candidate.slug !== project.slug)
    .filter((candidate) => matchesTheme(candidate, themeId))
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      if (b.year !== a.year) return b.year - a.year
      return a.sortOrder - b.sortOrder
    })
    .slice(0, limit)
}

export function primaryThemeForProject(project: Project): CareerThemeId {
  return themesForProject(project)[0] ?? (project.kind === 'tool' ? 'developer-tooling' : 'full-stack-apps')
}

export const projectKindFilters = [
  { id: 'all', label: 'All' },
  { id: 'case-study', label: 'Projects' },
  { id: 'tool', label: 'Tools' },
] as const

export const archiveViewModes = [
  { id: 'gallery', label: 'Gallery' },
  { id: 'directory', label: 'Directory' },
] as const

export const allProjectsSorted: Project[] = [...projects].sort((a, b) => {
  if (a.featured !== b.featured) return a.featured ? -1 : 1
  return a.sortOrder - b.sortOrder
})

export const featuredProjects: Project[] = [...projects].filter((project) => project.featured).sort((a, b) => a.sortOrder - b.sortOrder)

export const toolProjects: Project[] = projects.filter((project) => project.kind === 'tool')

export function archiveKindLabel(kind: Project['kind'] | 'all'): string {
  if (kind === 'tool') return 'Tools'
  if (kind === 'case-study') return 'Projects'
  return 'All'
}

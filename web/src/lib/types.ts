export type ProjectKind = 'case-study' | 'tool'

export type CareerThemeId =
  | 'backend-engineering'
  | 'full-stack-apps'
  | 'ai-ml-integration'
  | 'devops-infra'
  | 'developer-tooling'
  | 'data-pipelines'
  | 'product-systems'
  | 'community-platforms'
  | 'security-identity'
  | 'media-workflows'
  | 'interactive-systems'

export type CuratedSetId = 'featured-systems' | 'ai-automation' | 'devtools-infra'

export interface ProjectMedia {
  src: string
  alt: string
  caption?: string
}

export interface Project {
  slug: string
  title: string
  kind: ProjectKind
  summary: string
  description: string
  role: string
  year: number
  repoUrl?: string
  liveUrl?: string
  featured: boolean
  sortOrder: number
  stack: string[]
  highlights: string[]
  architecture?: string[]
  lessons?: string[]
  media: ProjectMedia[]
}

export interface CareerTheme {
  id: CareerThemeId
  label: string
  description: string
}

export interface CuratedSet {
  id: CuratedSetId
  label: string
  purpose: string
  takeaway: string
  slugs: string[]
}

export interface DevlogPost {
  id: string
  date: string
  title: string
  body: string
  tags: string[]
  source: string
  projectRef?: string
}

export type ProjectStatus = 'live' | 'open-source' | 'case-study' | 'in-development'

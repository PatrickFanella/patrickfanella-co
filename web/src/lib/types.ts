export type ProjectKind = 'case-study' | 'tool'

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

export type CategoryId =
  | 'web-apps'
  | 'ai-agents'
  | 'tools'
  | 'infrastructure'
  | 'streaming'
  | 'experiments'

export interface Category {
  id: CategoryId
  label: string
  description: string
}

export type CuratedSetId = 'featured-systems' | 'ai-automation' | 'devtools-infra'

export interface CuratedSet {
  id: CuratedSetId
  label: string
  purpose: string
  takeaway: string
  slugs: string[]
}

export type ProjectStatus = 'live' | 'open-source' | 'case-study' | 'in-development'

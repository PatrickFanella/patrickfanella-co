// Compute display statuses (badges) for a project.
import type { Project } from './types'

export function statusBadges(p: Project): string[] {
  const badges: string[] = []
  if (p.liveUrl) badges.push('Live')
  if (p.repoUrl) badges.push('Open Source')
  if (p.kind === 'case-study') badges.push('Case Study')
  return badges
}

export function typeLabel(p: Project): string {
  return p.kind === 'tool' ? 'Tool' : 'Project'
}

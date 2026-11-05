import { Link } from 'react-router-dom'

import type { Project } from '../lib/api'

export function ProjectRelations({ project }: { project: Project }) {
  if (!project.relatedProjects?.length) return null

  return <ul className="project-relations grid list-none gap-2 p-0 text-sm leading-relaxed text-ink-soft">
    {project.relatedProjects.map((related) => <li key={related.slug}>{related.relationship}: <Link className="text-accent-green underline underline-offset-4" to={`/projects/${related.slug}`}>{related.label}</Link></li>)}
  </ul>
}

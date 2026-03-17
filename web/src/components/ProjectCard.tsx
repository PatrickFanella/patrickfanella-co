import { Link } from 'react-router-dom'

import type { Project } from '../lib/api'
import {
  monoLabelClass,
  secondaryButtonClass,
  surfaceCardClass,
  tagClass,
  tagListClass,
} from '../lib/styles'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={`${surfaceCardClass} p-5.5 transition duration-200 hover:-translate-y-1 hover:-rotate-[0.2deg]`}
    >
      <div className="mb-5.5 flex flex-wrap items-start justify-between gap-3">
        <p className={monoLabelClass}>{project.year}</p>
        <p className={monoLabelClass}>{project.role}</p>
      </div>

      <div>
        <h3 className="mb-2 text-2xl leading-tight text-heading">{project.title}</h3>
        <p className="text-ink-soft">{project.summary}</p>
      </div>

      <ul className={tagListClass} aria-label={`${project.title} technology stack`}>
        {project.stack.map((item) => (
          <li key={item} className={tagClass}>
            {item}
          </li>
        ))}
      </ul>

      <Link className={`${secondaryButtonClass} mt-5.5`} to={`/projects/${project.slug}`}>
        Open case study
      </Link>
    </article>
  )
}

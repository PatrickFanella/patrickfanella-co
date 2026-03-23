import { Link } from 'react-router-dom'

import type { Project } from '../lib/api'
import {
  monoLabelClass,
  secondaryButtonClass,
  surfaceCardClass,
  tagCompactClass,
} from '../lib/styles'

type ProjectCardProps = {
  order?: number
  project: Project
}

export function ProjectCard({ order, project }: ProjectCardProps) {
  const orderLabel = order ? order.toString().padStart(2, '0') : null

  return (
    <article
      className={`${surfaceCardClass} group flex h-full flex-col justify-between p-7 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}
    >
      <div className="mb-4 grid gap-5 border-b-2 border-stroke pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {orderLabel ? (
              <p className="border-2 border-heading bg-heading px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-paper">
                {orderLabel}
              </p>
            ) : null}
            <p className="border-2 border-stroke bg-panel px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-heading">
              {project.year}
            </p>
          </div>

          <p className="border-2 border-stroke bg-surface px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent-pink">
            {project.role}
          </p>
        </div>

        <div>
          <h3 className="max-w-[14ch] font-display text-[2.25rem] font-bold leading-[0.92] tracking-[-0.05em] text-heading md:text-[2.5rem]">
            {project.title}
          </h3>
          <p className="mt-3 max-w-[42ch] text-[1.05rem] leading-relaxed text-ink-soft">
            {project.summary}
          </p>
        </div>
      </div>

      <ul className="flex list-none flex-wrap gap-1.5 p-0" aria-label={`${project.title} technology stack`}>
        {project.stack.slice(0, 8).map((item) => (
          <li key={item} className={tagCompactClass}>
            {item}
          </li>
        ))}
        {project.stack.length > 8 ? (
          <li className={`${tagCompactClass} text-accent-purple`}>
            +{project.stack.length - 8}
          </li>
        ) : null}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-stroke pt-4">
        {project.featured ? <p className={monoLabelClass}>Featured Project</p> : <span />}

        <Link className={secondaryButtonClass} to={`/projects/${project.slug}`}>
          Read Case Study
        </Link>
      </div>
    </article>
  )
}

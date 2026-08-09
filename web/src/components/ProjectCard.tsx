import { Link } from 'react-router-dom'

import type { Project } from '../lib/api'
import {
  monoLabelClass,
  secondaryButtonClass,
  surfaceCardClass,
} from '../lib/styles'
import { StackCueList } from './StackCueList'

type ProjectCardProps = {
  order?: number
  project: Project
  density?: 'featured' | 'archive'
}

export function ProjectCard({ order, project, density = 'featured' }: ProjectCardProps) {
  const orderLabel = order ? order.toString().padStart(2, '0') : null
  const isArchive = density === 'archive'
  const maxVisibleStack = isArchive ? 2 : 3
  const kindLabel = project.classification === 'experiment' ? 'Experiment' : project.classification === 'archive' ? 'Archive' : 'Flagship Case Study'
  const ctaLabel = project.classification === 'flagship' ? 'Read Case Study' : 'View Project'

  return (
    <article
      className={`${surfaceCardClass} group flex h-full flex-col justify-between ${isArchive ? 'p-5' : 'p-7'} hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}
    >
      <div className={`${isArchive ? 'mb-3 gap-4' : 'mb-4 gap-5'} grid border-b-2 border-stroke pb-4`}>
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

          {!isArchive ? (
            <p className="border-2 border-stroke bg-surface px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent-pink">
              {project.role}
            </p>
          ) : null}
        </div>

        <div>
          <h3 className={`${isArchive ? 'max-w-[18ch] text-[1.75rem] md:text-[2rem]' : 'max-w-[14ch] text-[2.25rem] md:text-[2.5rem]'} font-display font-bold leading-[0.92] tracking-[-0.05em] text-heading`}>
            {project.title}
          </h3>
          <p className={`${isArchive ? 'mt-2 text-[0.98rem]' : 'mt-3 text-[1.05rem]'} max-w-[42ch] leading-relaxed text-ink-soft`}>
            {project.summary}
          </p>
        </div>
      </div>

      <StackCueList ariaLabel={`${project.title} technology stack`} items={project.stack} maxVisible={maxVisibleStack} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-stroke pt-4">
        {project.featured ? <p className={monoLabelClass}>Flagship Case Study</p> : isArchive ? <p className={monoLabelClass}>{kindLabel}</p> : <span />}

        <Link className={secondaryButtonClass} to={`/projects/${project.slug}`}>
          {ctaLabel}
        </Link>
      </div>
    </article>
  )
}

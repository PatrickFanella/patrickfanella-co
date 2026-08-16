import { Link } from 'react-router-dom'

import type { Project } from '../lib/api'
import {
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
  const ctaLabel = project.classification === 'flagship' ? 'Read Case Study' : 'View Project'

  return (
    <article
      className={`${surfaceCardClass} group flex h-full flex-col justify-between ${isArchive ? 'p-5' : 'p-7'} hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}
    >
      <div className={`${isArchive ? 'mb-3 gap-4' : 'mb-4 gap-5'} grid border-b-2 border-stroke pb-4`}>
        {orderLabel ? (
          <p className="w-fit border-2 border-heading bg-heading px-3 pt-[calc(0.25rem+0.5px)] pb-[calc(0.25rem-0.5px)] font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-paper">
            {orderLabel}
          </p>
        ) : null}

        <div>
          <h3 className={`${isArchive ? 'max-w-[18ch] text-[1.75rem] md:text-[2rem]' : 'max-w-[14ch] text-[2.25rem] md:text-[2.5rem]'} font-display font-bold leading-[0.92] tracking-[-0.05em] text-heading`}>
            {project.title}
          </h3>
          <p className={`${isArchive ? 'mt-2 text-[0.98rem]' : 'mt-3 text-[1.05rem]'} max-w-[42ch] leading-relaxed text-ink-soft`}>
            {project.summary}
          </p>
        </div>
      </div>

      <div className="min-h-[2.5rem]">
        <StackCueList ariaLabel={`${project.title} technology stack`} items={project.stack} maxVisible={maxVisibleStack} />
      </div>

      <div className="mt-4 flex items-center justify-end gap-4 border-t-2 border-stroke pt-4">
        <Link className={secondaryButtonClass} to={`/projects/${project.slug}`}>
          {ctaLabel}
        </Link>
      </div>
    </article>
  )
}

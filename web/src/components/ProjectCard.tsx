import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import type { Project } from '../lib/api'
import {
  monoLabelClass,
  secondaryButtonClass,
  surfaceCardClass,
} from '../lib/styles'
import { getTechColor } from '../lib/techColors'

type ProjectCardProps = {
  linkToRepository?: boolean
  order?: number
  project: Project
}

export function ProjectCard({ linkToRepository = false, order, project }: ProjectCardProps) {
  const orderLabel = order ? order.toString().padStart(2, '0') : null
  const ctaLabel = project.kind === 'case-study'
    ? 'Read case study'
    : project.kind === 'highlight'
      ? 'View project'
      : 'View tool'

  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const pipContainerRef = useRef<HTMLDivElement>(null)

  const handlePipMove = (e: React.MouseEvent, tech: string) => {
    const rect = pipContainerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setHoveredTech(tech)
  }

  return (
    <article
      className={`${surfaceCardClass} group flex h-full flex-col p-7 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}
    >
      {/* Top row: order badge + category */}
      <div className="flex items-start justify-between gap-3">
        {orderLabel ? (
          <p className="w-fit border-2 border-heading bg-heading px-3 pt-[calc(0.25rem+0.5px)] pb-[calc(0.25rem-0.5px)] font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-paper">
            {orderLabel}
          </p>
        ) : null}
        {project.category ? (
          <p className={`${monoLabelClass} text-right`}>{project.category}</p>
        ) : null}
      </div>

      {/* Title + summary */}
      <div className="mt-4 pb-4">
        <h3 className="max-w-[14ch] font-display text-[clamp(1.9rem,3vw,2.5rem)] font-bold leading-[0.92] tracking-[-0.05em] text-heading md:text-[2rem] xl:text-[2.25rem]">
          {project.title}
        </h3>
        <p className="mt-3 max-w-[42ch] text-[1.05rem] leading-relaxed text-ink-soft">
          {project.summary}
        </p>
      </div>

      {/* Stack pips with hover tooltip */}
      <div className="mt-auto border-t-2 border-b-2 border-stroke pt-4 pb-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-ink-soft">Stack</p>
        <div
          ref={pipContainerRef}
          className="relative mt-2 flex flex-wrap gap-1.5"
          aria-label={`${project.stack.length} technologies in the stack: ${project.stack.join(', ')}`}
          onMouseLeave={() => setHoveredTech(null)}
        >
          {project.stack.map((tech) => (
            <span
              key={tech}
              aria-label={tech}
              className="h-2.5 w-2.5 cursor-pointer transition-transform hover:scale-150"
              style={{ backgroundColor: getTechColor(tech) }}
              onMouseMove={(e) => handlePipMove(e, tech)}
              onMouseEnter={(e) => handlePipMove(e, tech)}
            />
          ))}
          {hoveredTech ? (
            <div
              className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap border-2 border-heading bg-panel px-2.5 py-1 font-mono text-[0.7rem] font-bold uppercase tracking-[0.1em] text-heading shadow-brutal-green"
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y - 10}px` }}
            >
              {hoveredTech}
            </div>
          ) : null}
        </div>
      </div>

      {/* Footer: status + CTA */}
      <div className="mt-4 flex items-center justify-between">
        <div className={`${monoLabelClass} text-left`}>
          {project.deliveryStatus}
        </div>
        {linkToRepository && project.repoUrl ? (
          <a
            aria-label={`View repository: ${project.title}`}
            className={`${secondaryButtonClass} text-nowrap`}
            href={project.repoUrl}
            rel="noreferrer"
            target="_blank"
          >
            View repository
          </a>
        ) : linkToRepository ? (
          <span className={`${monoLabelClass} text-right`}>Source unavailable</span>
        ) : (
          <Link
            aria-label={`${ctaLabel}: ${project.title}`}
            className={`${secondaryButtonClass} text-nowrap`}
            to={`/projects/${project.slug}`}
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </article>
  )
}

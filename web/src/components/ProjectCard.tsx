import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Project } from '../lib/types'
import { statusBadges, typeLabel } from '../lib/project-utils'

interface Props {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: Props) {
  const badges = statusBadges(project)
  const img = project.media[0]
  const isTool = project.kind === 'tool'

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.18) }}
      className="group relative surface overflow-hidden flex flex-col hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev-2)] transition-colors"
    >
      <Link to={`/projects/${project.slug}`} className="block aspect-[16/10] overflow-hidden bg-[color:var(--color-bg-elev-2)]">
        <img
          src={img?.src ?? '/assets/projects/project-fallback.svg'}
          alt={img?.alt ?? `${project.title} preview`}
          loading="lazy"
          className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
        />
      </Link>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[color:var(--color-fg-dim)] font-mono">
          <span>{typeLabel(project)}</span>
          {project.liveUrl && <><span aria-hidden>·</span><span className="text-[color:var(--color-success)]">Live</span></>}
          {isTool && <><span aria-hidden>·</span><span className="text-[color:var(--color-warning)]">Tool</span></>}
        </div>
        <Link to={`/projects/${project.slug}`} className="block">
          <h3 className="text-lg font-semibold tracking-tight text-[color:var(--color-fg)] group-hover:text-[color:var(--color-accent-soft)] transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed line-clamp-3">
          {project.summary}
        </p>
        {project.stack.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {project.stack.slice(0, 4).map((s) => (
              <li key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[color:var(--color-bg-elev-2)] text-[color:var(--color-fg-muted)] border border-[color:var(--color-border)]">
                {s}
              </li>
            ))}
            {project.stack.length > 4 && (
              <li className="text-[10px] font-mono px-1.5 py-0.5 text-[color:var(--color-fg-dim)]">
                +{project.stack.length - 4}
              </li>
            )}
          </ul>
        )}
        <div className="flex items-center gap-3 pt-3 border-t border-[color:var(--color-border)]/60 text-xs">
          <Link to={`/projects/${project.slug}`} className="text-[color:var(--color-accent-soft)] hover:underline">
            View Project →
          </Link>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]">
              Live ↗
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]">
              GitHub ↗
            </a>
          )}
          {badges.length > 0 && (
            <span className="ml-auto text-[10px] font-mono text-[color:var(--color-fg-dim)]">
              {badges.join(' · ')}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

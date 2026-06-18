import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Project } from '../lib/types'
import { statusBadges, typeLabel } from '../lib/project-utils'
import { themeLabel, themesForProject } from '../data/portfolio'
import { WorkMediaPlaceholder } from './WorkMediaPlaceholder'
import { assetsFor } from '../data/project-assets'

interface Props {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: Props) {
  const badges = statusBadges(project)
  const themes = themesForProject(project).slice(0, 3).map((themeId) => themeLabel(themeId))
  const assets = assetsFor(project.slug)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.18) }}
      className="group relative overflow-hidden panel flex flex-col transition-colors hover:border-[color:var(--color-border-strong)]"
    >
      <Link to={`/projects/${project.slug}`} className="block">
        <WorkMediaPlaceholder
          title={project.title}
          kicker={typeLabel(project)}
          summary={project.summary}
          caption={themes.join(' · ') || 'Portfolio placeholder asset'}
          accent={project.kind === 'tool' ? 'amber' : project.featured ? 'violet' : 'green'}
          className="rounded-none border-0"
          src={assets.hero ?? assets.thumbSquare}
          video={assets.video}
        />
      </Link>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-fg-dim)] font-mono">
          <span>{typeLabel(project)}</span>
          <span aria-hidden>·</span>
          <span>{project.year}</span>
          {project.liveUrl && (
            <>
              <span aria-hidden>·</span>
              <span className="text-[color:var(--color-success)]">Live</span>
            </>
          )}
          {project.kind === 'tool' && (
            <>
              <span aria-hidden>·</span>
              <span className="text-[color:var(--color-warning)]">Tool</span>
            </>
          )}
        </div>

        <Link to={`/projects/${project.slug}`} className="block">
          <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-fg)] transition-colors group-hover:text-[color:var(--color-accent-soft)]">
            {project.title}
          </h3>
        </Link>

        <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed line-clamp-3">{project.summary}</p>

        {themes.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {themes.map((theme) => (
              <li key={theme} className="chip text-[10px]">
                {theme}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-3 pt-3 border-t border-[color:var(--color-border)]/70 text-xs">
          <Link to={`/projects/${project.slug}`} className="text-[color:var(--color-accent-soft)] hover:underline">
            Open detail →
          </Link>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]">
              Live ↗
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]">
              Repo ↗
            </a>
          )}
          {badges.length > 0 && <span className="ml-auto text-[10px] font-mono text-[color:var(--color-fg-dim)]">{badges.join(' · ')}</span>}
        </div>
      </div>
    </motion.article>
  )
}

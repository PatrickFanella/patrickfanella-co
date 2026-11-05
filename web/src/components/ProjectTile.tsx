import { Link } from 'react-router-dom'
import type { Project } from '../lib/api'
import { monoLabelClass, textLinkClass } from '../lib/styles'
import { Icon } from './Icon'
import { ProjectBrand } from './ProjectBrand'
import { ProjectRelations } from './ProjectRelations'

export function ProjectTile({ project }: { project: Project }) {
  const thumbnail = project.thumbnailUrl || project.media.find((media) => media.src.includes('/screenshots/'))?.src || project.logoUrl
  const identityOnly = thumbnail === project.logoUrl
  const ctaLabel = project.classification === 'flagship' ? 'Read case study' : project.kind === 'tool' ? 'Explore tool' : 'View project'
  const sourceUrl = project.repoUrl || project.sourceUrl
  return (
    <article className="archive-tile project-tile">
      {thumbnail ? <div className="archive-thumbnail" style={{ backgroundColor: project.brandBackground || '#21222c' }}>
        <img alt={identityOnly ? '' : project.thumbnailAlt || `${project.title} project preview`} className={identityOnly ? 'h-full w-full object-contain p-10' : 'h-full w-full object-cover object-top'} decoding="async" height={600} loading="lazy" src={thumbnail} width={960} />
      </div> : <div aria-hidden="true" className="archive-thumbnail grid place-items-center font-display text-5xl font-bold text-accent-purple">{project.title.slice(0, 2)}</div>}
      <div className="project-tile-header">
        <ProjectBrand project={project} />
        <div className="min-w-0 flex-1">
          <h3 className="project-tile-title font-display text-2xl font-bold leading-tight text-heading" title={project.title}>{project.title}</h3>
          <p className={`${monoLabelClass} mt-1`}>{project.deliveryStatus}</p>
        </div>
      </div>
      <p className="project-tile-summary text-sm leading-relaxed text-ink-soft">{project.summary}</p>
      <div className="project-tile-relations"><ProjectRelations project={project} /></div>
      <div className="project-tile-links flex flex-wrap gap-x-5 gap-y-2">
        <Link aria-label={`${ctaLabel}: ${project.title}`} className={textLinkClass} to={`/projects/${project.slug}`}>{ctaLabel}</Link>
        {sourceUrl ? <a aria-label={`${project.repoUrl ? 'View repository' : 'Download source code'}: ${project.title}`} className={textLinkClass} href={sourceUrl} rel="noreferrer" target="_blank"><Icon name={project.repoUrl ? 'gitea' : 'download'} className="h-4 w-4" />{project.repoUrl ? 'Repository' : 'Source code'}</a> : null}
      </div>
    </article>
  )
}

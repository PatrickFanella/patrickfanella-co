import { Link } from 'react-router-dom'
import type { Project } from '../lib/api'
import { monoLabelClass, textLinkClass } from '../lib/styles'
import { Icon } from './Icon'
import { ProjectBrand } from './ProjectBrand'

export function ProjectTile({ project }: { project: Project }) {
  const thumbnail = project.thumbnailUrl || project.media.find((media) => media.src.includes('/screenshots/'))?.src || project.logoUrl
  const identityOnly = thumbnail === project.logoUrl
  return (
    <article className="archive-tile">
      {thumbnail ? <div className="archive-thumbnail" style={{ backgroundColor: project.brandBackground || '#21222c' }}>
        <img alt={identityOnly ? '' : project.thumbnailAlt || `${project.title} project preview`} className={identityOnly ? 'h-full w-full object-contain p-10' : 'h-full w-full object-cover object-top'} decoding="async" height={600} loading="lazy" src={thumbnail} width={960} />
      </div> : <div aria-hidden="true" className="archive-thumbnail grid place-items-center font-display text-5xl font-bold text-accent-purple">{project.title.slice(0, 2)}</div>}
      <div className="grid flex-1 content-start gap-4 p-5">
        <div className="flex items-center gap-3"><ProjectBrand project={project} /><h3 className="min-w-0 font-display text-2xl font-bold leading-tight text-heading">{project.title}</h3></div>
        <p className={monoLabelClass}>{project.deliveryStatus}</p>
        <p className="text-sm leading-relaxed text-ink-soft">{project.summary}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {project.kind !== 'tool' ? <Link aria-label={`View project: ${project.title}`} className={textLinkClass} to={`/projects/${project.slug}`}>View project</Link> : null}
          {project.repoUrl ? <a aria-label={`Repository: ${project.title}`} className={textLinkClass} href={project.repoUrl} rel="noreferrer" target="_blank"><Icon name="gitea" className="h-4 w-4" />Repository</a> : null}
        </div>
      </div>
    </article>
  )
}

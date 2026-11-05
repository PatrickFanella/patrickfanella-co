import { Link } from 'react-router-dom'

import type { Project } from '../lib/api'
import { textLinkClass } from '../lib/styles'

type ProjectCardProps = {
  headingLevel?: 'h2' | 'h3'
  linkToRepository?: boolean
  project: Project
}

export function ProjectCard({ headingLevel = 'h3', linkToRepository = false, project }: ProjectCardProps) {
  const Heading = headingLevel
  const screenshot = project.media.find((media) => media.src.includes('/screenshots/'))
  const ctaLabel = project.kind === 'case-study'
    ? 'Read case study'
    : project.kind === 'highlight' ? 'View project' : 'View tool'

  return (
    <article className={`project-entry ${screenshot ? 'project-entry-with-image' : ''}`}>
      <div className="project-entry-copy">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft">
          <p>{project.category}</p>
          <p className={`project-status ${project.deliveryStatus === 'Production' ? 'project-status-live' : ''}`}>
            {project.deliveryStatus}
          </p>
        </div>
        <Heading className="mt-5 font-display text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-tight tracking-[-0.04em] text-heading">
          {project.title}
        </Heading>
        <p className="mt-4 max-w-[58ch] leading-relaxed text-ink-soft">{project.summary}</p>
        <ul aria-label={`${project.title} technologies`} className="mt-5 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-sm text-ink">
          {project.stack.map((tech) => <li key={tech}>{tech}</li>)}
        </ul>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          {linkToRepository && project.repoUrl ? (
            <a aria-label={`View repository: ${project.title}`} className={textLinkClass} href={project.repoUrl} rel="noreferrer" target="_blank">View repository</a>
          ) : linkToRepository ? (
            <span className="text-sm text-ink-soft">Source unavailable</span>
          ) : (
            <Link aria-label={`${ctaLabel}: ${project.title}`} className={textLinkClass} to={`/projects/${project.slug}`}>{ctaLabel}</Link>
          )}
          {!linkToRepository && project.repoUrl ? (
            <a aria-label={`View repository: ${project.title}`} className="text-sm text-ink-soft underline underline-offset-4 hover:text-heading" href={project.repoUrl} rel="noreferrer" target="_blank">Source code</a>
          ) : null}
        </div>
      </div>
      {screenshot ? (
        <figure className="project-entry-media">
          <img alt={screenshot.alt} className="aspect-[16/10] w-full border border-stroke object-cover object-top" decoding="async" height={900} loading="lazy" sizes="(min-width: 900px) 50vw, 100vw" src={screenshot.src} srcSet={screenshot.srcSet} width={1440} />
          {screenshot.caption ? <figcaption className="mt-3 text-xs leading-relaxed text-ink-soft">{screenshot.caption}</figcaption> : null}
        </figure>
      ) : null}
    </article>
  )
}

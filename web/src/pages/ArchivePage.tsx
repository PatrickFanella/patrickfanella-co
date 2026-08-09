import { Link } from 'react-router-dom'

import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import type { Project } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import { monoLabelClass, pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass, surfaceCardClass, textLinkClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

function ArchiveGroup({ id, title, description, projects }: { id: string; title: string; description: string; projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <section className="grid gap-5" id={id} aria-labelledby={`${id}-heading`}>
      <div>
        <h2 className={monoLabelClass} id={`${id}-heading`}>{title}</h2>
        <p className="mt-3 max-w-[58ch] text-ink-soft">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article className={`${surfaceCardClass} grid gap-4 p-5`} key={project.slug}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-display text-2xl font-bold text-heading">{project.title}</h3>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-accent-pink">{project.deliveryStatus || title}</span>
            </div>
            <p className="text-sm leading-relaxed text-ink-soft">{project.summary}</p>
            <div className="flex flex-wrap gap-4">
              {project.kind === 'tool' && project.repoUrl ? <a className={textLinkClass} href={project.repoUrl} rel="noreferrer" target="_blank">Repository ↗</a> : <Link className={textLinkClass} to={`/projects/${project.slug}`}>Project details →</Link>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ArchivePage() {
  const { projects, status, error, retry } = useProjects()
  const nonFlagships = projects.filter((project) => project.classification !== 'flagship')
  const experiments = nonFlagships.filter((project) => project.classification === 'experiment' && project.kind !== 'tool')
  const archived = nonFlagships.filter((project) => project.classification === 'archive' && project.kind !== 'tool')
  const tools = nonFlagships.filter((project) => project.kind === 'tool')

  return (
    <section className={`${pageSectionClass} pt-3`}>
      <Seo description="Older projects, experiments, and tools retained for provenance." path="/archive" robots="noindex,follow" title="Archive" />
      <div className="mb-10 border-b-2 border-stroke pb-9">
        <SectionLabel>Supporting evidence</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5 uppercase`}>Archive</h1>
        <p className={pageIntroClass}>Experiments, utilities, and earlier work remain publicly verifiable here, but they are not presented as equal-weight flagship case studies.</p>
      </div>

      {status === 'loading' ? <RouteState ariaLive="polite" description="Loading archived work." label="Loading" role="status" title="Archive incoming." /> : null}
      {status === 'error' ? <RouteState actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>} description={getErrorMessage(error, 'Please try again in a moment.')} label="Unavailable" role="alert" title="The archive could not be loaded." /> : null}
      {status === 'success' ? (
        <div className="grid gap-14">
          <ArchiveGroup description="Focused technical investigations and prototypes. Their status and limitations are part of the record." id="experiments" projects={experiments} title="Experiments" />
          <ArchiveGroup description="Earlier or non-priority product work retained for provenance." id="projects-archive" projects={archived} title="Archived projects" />
          <ArchiveGroup description="Small developer utilities and operational tools." id="tools" projects={tools} title="Tools" />
        </div>
      ) : null}
    </section>
  )
}

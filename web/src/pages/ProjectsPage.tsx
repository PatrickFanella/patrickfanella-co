import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { getErrorMessage } from '../lib/errors'
import {
  monoLabelClass,
  pageIntroClass,
  pageSectionClass,
  pageTitleClass,
  secondaryButtonClass,
  surfaceCardClass,
} from '../lib/styles'
import { useProjects } from '../lib/useProjects'

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const projectEntries = useMemo(
    () => projects.filter((project) => project.kind === 'case-study' || project.kind === 'highlight'),
    [projects],
  )
  const featuredCaseStudies = useMemo(() => projectEntries.filter((project) => project.classification === 'flagship'), [projectEntries])
  const experiments = useMemo(() => projectEntries.filter((project) => project.classification === 'experiment'), [projectEntries])
  const archive = useMemo(() => projectEntries.filter((project) => project.classification === 'archive'), [projectEntries])
  const featuredCountLabel = featuredCaseStudies.length === 1 ? 'featured case study' : 'featured case studies'
  const projectsError = getErrorMessage(error, 'Please try again in a moment.')

  const caseStudyEntries = useMemo(
    () => featuredCaseStudies.map((project, index) => ({ order: index + 1, project })),
    [featuredCaseStudies],
  )
  const featuredEntries = caseStudyEntries

  return (
    <section className={`${pageSectionClass} pt-4`}>
      <Seo
        description="Browse Patrick Fanella's production case studies, led by featured work and followed by a compact archive."
        path="/projects"
        title="Projects"
      />
      <div className="mb-10 grid gap-8 border-b-2 border-stroke pb-12 md:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)] md:items-start">
        <div>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>Projects</h1>
          <p className={pageIntroClass}>
            Three flagship case studies show the work most relevant to full-stack and product engineering roles. Everything else is explicitly catalogued as an experiment or archive.
          </p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
          <p className={monoLabelClass}>Featured first</p>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
            {status === 'success' && projectEntries.length > 0 ? (
              <>
                {featuredCaseStudies.length} {featuredCountLabel}, {experiments.length} experiment{experiments.length === 1 ? '' : 's'}, and {archive.length} archived project{archive.length === 1 ? '' : 's'} are available.
              </>
            ) : (
              <>Counts appear after the project index loads. Each card links to the full case study.</>
            )}
          </p>
        </aside>
      </div>

      {status === 'loading' ? (
        <div className="grid gap-6">
          <RouteState
            ariaLive="polite"
            description="Loading project index."
            label="Loading"
            role="status"
            title="Project index incoming."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <article key={index} className={`${surfaceCardClass} p-6`}>
                <div className="grid gap-5 border-b-2 border-stroke pb-5">
                  <div className="h-7 w-28 border-2 border-stroke bg-panel" />
                  <div className="grid gap-3">
                    <div className="h-12 w-2/3 border-2 border-stroke bg-panel" />
                    <div className="h-5 w-full border-2 border-stroke bg-panel" />
                    <div className="h-5 w-4/5 border-2 border-stroke bg-panel" />
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[0, 1, 2].map((tag) => (
                    <span key={tag} className="h-7 w-20 border-2 border-stroke bg-panel" />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {status === 'error' ? (
        <RouteState
          actions={(
            <button className={secondaryButtonClass} onClick={retry} type="button">
              Try Again
            </button>
          )}
          description={projectsError}
          label="Unavailable"
          role="alert"
          title="The project index couldn't be loaded."
        />
      ) : null}

      {status === 'success' && projectEntries.length === 0 ? (
        <RouteState
          description="The portfolio is online, but no case studies have been published yet."
          label="No projects yet"
          title="The case study archive is empty."
        />
      ) : null}

      {status === 'success' && projectEntries.length > 0 ? (
        <div className="grid gap-14">
          {featuredEntries.length > 0 ? (
            <section className="grid gap-5" aria-labelledby="featured-case-studies-heading">
              <div>
                <h2 id="featured-case-studies-heading" className={monoLabelClass}>
                  Featured Case Studies
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  The clearest evidence of shipped product work, technical judgment, and operational ownership.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {featuredEntries.map(({ order, project }) => (
                  <ProjectCard key={project.slug} order={order} project={project} />
                ))}
              </div>
            </section>
          ) : null}

          {experiments.length > 0 ? (
            <section className="grid gap-5" aria-labelledby="experiments-heading">
              <div>
                <h2 id="experiments-heading" className={monoLabelClass}>
                  Experiments
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  Focused prototypes and technical investigations. Useful supporting evidence, not equal-weight case studies.
                </p>
              </div>

              <div className="grid border-2 border-stroke bg-surface">
                {experiments.map((project) => (
                  <Link className="grid gap-1 border-b-2 border-stroke px-5 py-4 last:border-b-0 hover:bg-panel md:grid-cols-[minmax(0,1fr)_auto] md:items-center" key={project.slug} to={`/projects/${project.slug}`}>
                    <span className="font-display text-xl font-bold text-heading">{project.title}</span>
                    <span className={monoLabelClass}>Experiment · {project.year}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {archive.length > 0 ? (
            <section className="grid gap-5" aria-labelledby="archive-heading">
              <div>
                <h2 id="archive-heading" className={monoLabelClass}>
                  Archive
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  Earlier or non-priority work retained for provenance and verification.
                </p>
              </div>

              <div className="grid border-2 border-stroke bg-surface md:grid-cols-2">
                {archive.map((project) => (
                  <Link className="flex items-center justify-between gap-4 border-b-2 border-stroke px-5 py-4 hover:bg-panel md:[&:nth-last-child(-n+2)]:border-b-0" key={project.slug} to={`/projects/${project.slug}`}>
                    <span className="font-display text-lg font-bold text-heading">{project.title}</span>
                    <span className={monoLabelClass}>{project.year}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

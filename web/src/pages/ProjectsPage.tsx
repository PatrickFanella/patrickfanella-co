import { useMemo } from 'react'

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
  const caseStudies = projects.filter((project) => project.kind === 'case-study')
  const featuredCaseStudies = useMemo(() => caseStudies.filter((project) => project.featured), [caseStudies])
  const archiveCaseStudies = useMemo(() => caseStudies.filter((project) => !project.featured), [caseStudies])
  const featuredCountLabel = featuredCaseStudies.length === 1 ? 'featured case study' : 'featured case studies'
  const archiveCountLabel = archiveCaseStudies.length === 1 ? 'more case study' : 'more case studies'
  const projectsError = getErrorMessage(error, 'Please try again in a moment.')

  const caseStudyEntries = useMemo(
    () => caseStudies.map((project, index) => ({ order: index + 1, project })),
    [caseStudies],
  )
  const featuredEntries = caseStudyEntries.filter(({ project }) => project.featured)
  const archiveEntries = caseStudyEntries.filter(({ project }) => !project.featured)

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
            Each project below is a production case study: built, deployed, and documented. Start with the featured work, then browse the compact archive for the rest.
          </p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
          <p className={monoLabelClass}>Featured first</p>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
            {status === 'success' && caseStudies.length > 0 ? (
              <>
                {featuredCaseStudies.length} {featuredCountLabel} and {archiveCaseStudies.length} {archiveCountLabel} are available. Each card links to the full case study.
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

      {status === 'success' && caseStudies.length === 0 ? (
        <RouteState
          description="The portfolio is online, but no case studies have been published yet."
          label="No projects yet"
          title="The case study archive is empty."
        />
      ) : null}

      {status === 'success' && caseStudies.length > 0 ? (
        <div className="grid gap-14">
          {featuredEntries.length > 0 ? (
            <section className="grid gap-5" aria-labelledby="featured-case-studies-heading">
              <div>
                <h2 id="featured-case-studies-heading" className={monoLabelClass}>
                  Featured Case Studies
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  {featuredEntries.length} curated case study{featuredEntries.length === 1 ? '' : 's'} leading the archive.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {featuredEntries.map(({ order, project }) => (
                  <ProjectCard key={project.slug} order={order} project={project} />
                ))}
              </div>
            </section>
          ) : null}

          {archiveEntries.length > 0 ? (
            <section className="grid gap-5" aria-labelledby="more-case-studies-heading">
              <div>
                <h2 id="more-case-studies-heading" className={monoLabelClass}>
                  More Case Studies
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  {archiveEntries.length} additional case study{archiveEntries.length === 1 ? '' : 's'} in a compact archive.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {archiveEntries.map(({ order, project }) => (
                  <ProjectCard key={project.slug} density="archive" order={order} project={project} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

import { useMemo, useState } from 'react'

import { ProjectCard } from '../components/ProjectCard'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { monoLabelClass, pageIntroClass, pageSectionClass, pageTitleClass, surfaceCardClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

export function ProjectsPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const { projects, status, error, retry } = useProjects()
  const availableTags = useMemo(
    () => [...new Set(projects.flatMap((project) => project.stack))].sort((left, right) => left.localeCompare(right)),
    [projects],
  )
  const visibleProjects = activeTag
    ? projects.filter((project) => project.stack.includes(activeTag))
    : projects
  const featuredProjects = visibleProjects.filter((project) => project.featured)
  const archivedProjects = visibleProjects.filter((project) => !project.featured)
  const projectsError = getErrorMessage(error, 'The project index could not be loaded from the API.')
  const filterButtonClass =
    'inline-flex cursor-pointer items-center justify-center border-2 px-4 py-2 text-[0.72rem] font-mono font-bold uppercase tracking-[0.15em] transition-all duration-150 ease-linear focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 focus-visible:ring-offset-paper'

  return (
    <section className={`${pageSectionClass} pt-4`}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)] md:items-start border-b-2 border-stroke pb-12 mb-10">
        <div>
          <SectionLabel>Database query</SectionLabel>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>
            Selected projects and archive.
          </h1>
          <p className={pageIntroClass}>
            Browse shipped work by stack, then open each case study for architecture notes, supporting visuals, and implementation takeaways.
          </p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
          <p className={monoLabelClass}>Protocol</p>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
            Use the tag filters to narrow the archive by stack or problem space. The view keeps featured work visible when relevant without burying older builds.
          </p>
        </aside>
      </div>

      {status === 'loading' ? (
        <div className="grid gap-6" aria-live="polite" role="status">
          <article className={`${surfaceCardClass} bg-panel p-6`}>
            <p className={monoLabelClass}>Loading</p>
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
              Hydrating the featured set and archive directly from the API.
            </p>
          </article>

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
        <article className={`${surfaceCardClass} grid gap-6 bg-panel p-8`} role="alert">
          <div>
            <p className={monoLabelClass}>Query failed</p>
            <h2 className="mt-5 font-display text-[2rem] font-bold uppercase tracking-[-0.04em] text-heading">
              Project index unavailable.
            </h2>
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">{projectsError}</p>
          </div>

          <div>
            <button
              className="inline-flex cursor-pointer items-center justify-center border-2 border-stroke bg-surface px-6 py-3 text-sm font-bold uppercase tracking-[0.05em] text-heading transition-all duration-150 ease-linear hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-purple hover:text-accent-purple hover:shadow-brutal-purple"
              onClick={retry}
              type="button"
            >
              Retry query
            </button>
          </div>
        </article>
      ) : null}

      {status === 'success' && projects.length === 0 ? (
        <article className={`${surfaceCardClass} bg-panel p-8`}>
          <p className={monoLabelClass}>No records</p>
          <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
            The portfolio database is reachable, but it does not contain any seeded projects yet.
          </p>
        </article>
      ) : null}

      {status === 'success' && projects.length > 0 ? (
        <div className="grid gap-14">
          <section className={`${surfaceCardClass} grid gap-5 bg-panel p-6`} aria-label="Project filters">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className={monoLabelClass}>Filters</p>
                <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                  Showing {visibleProjects.length} of {projects.length} projects
                  {activeTag ? ` tagged ${activeTag}.` : '.'}
                </p>
              </div>
              {activeTag ? (
                <button
                  className={`${filterButtonClass} border-stroke bg-surface text-heading hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-purple hover:text-accent-purple hover:shadow-brutal-purple`}
                  onClick={() => setActiveTag(null)}
                  type="button"
                >
                  Reset filter
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                aria-pressed={activeTag === null}
                className={`${filterButtonClass} ${
                  activeTag === null
                    ? 'border-accent-green bg-accent-green text-paper'
                    : 'border-stroke bg-surface text-heading hover:border-accent-purple hover:text-accent-purple'
                }`}
                onClick={() => setActiveTag(null)}
                type="button"
              >
                All
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  aria-pressed={activeTag === tag}
                  className={`${filterButtonClass} ${
                    activeTag === tag
                      ? 'border-accent-green bg-accent-green text-paper'
                      : 'border-stroke bg-surface text-heading hover:border-accent-purple hover:text-accent-purple'
                  }`}
                  onClick={() => setActiveTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="grid gap-6">
            <div className="grid gap-3">
              <SectionLabel>Featured set</SectionLabel>
              <p className="max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                Project stories that lead the portfolio and anchor the first pass through the archive.
              </p>
            </div>

            {featuredProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={project.slug} order={index + 1} project={project} />
                ))}
              </div>
            ) : (
              <article className={`${surfaceCardClass} bg-panel p-8`}>
                <p className={monoLabelClass}>Featured slice empty</p>
                <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                  {activeTag
                    ? `There are no featured projects tagged ${activeTag} in the current seed set.`
                    : 'Featured projects will appear here once the launch set is marked for first-pass review.'}
                </p>
              </article>
            )}
          </section>

          <section className="grid gap-6 border-t-2 border-stroke pt-12">
            <div className="grid gap-3">
              <SectionLabel>Archive</SectionLabel>
              <p className="max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                Additional work kept live for deeper browsing without crowding the primary case studies.
              </p>
            </div>

            {archivedProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {archivedProjects.map((project, index) => (
                  <ProjectCard key={project.slug} order={featuredProjects.length + index + 1} project={project} />
                ))}
              </div>
            ) : (
              <article className={`${surfaceCardClass} bg-panel p-8`}>
                  <p className={monoLabelClass}>{activeTag ? 'No archive matches' : 'Archive empty'}</p>
                <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                    {activeTag
                      ? `No archived projects currently match the ${activeTag} filter. Try another tag or reset the view.`
                      : 'The current launch dataset only contains featured projects. Archive expansion can land in a follow-up phase without rewiring this page.'}
                </p>
              </article>
            )}
          </section>
        </div>
      ) : null}
    </section>
  )
}

import { ProjectCard } from '../components/ProjectCard'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { monoLabelClass, pageIntroClass, pageSectionClass, pageTitleClass, surfaceCardClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const featuredProjects = projects.filter((project) => project.featured)
  const archivedProjects = projects.filter((project) => !project.featured)
  const projectsError = getErrorMessage(error, 'The project index could not be loaded from the API.')

  return (
    <section className={`${pageSectionClass} pt-4`}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)] md:items-start border-b-2 border-stroke pb-12 mb-10">
        <div>
          <SectionLabel>Database query</SectionLabel>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>
            Project master log.
          </h1>
          <p className={pageIntroClass}>
            Chronological registry of delivered frontends, APIs, plugins, and architectures spanning the current phase of practice. Filter by relevance when scanning.
          </p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
          <p className={monoLabelClass}>Protocol</p>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
            Scan for stacks or problems aligned with your current scope. Open individual entries for topology breakdowns, explicit technical choices, and hard outcome metrics.
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
          <section className="grid gap-6">
            <div className="grid gap-3">
              <SectionLabel>Featured set</SectionLabel>
              <p className="max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                Priority case studies surfaced on the home page and ordered for first-pass review.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.slug} order={index + 1} project={project} />
              ))}
            </div>
          </section>

          <section className="grid gap-6 border-t-2 border-stroke pt-12">
            <div className="grid gap-3">
              <SectionLabel>Archive</SectionLabel>
              <p className="max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                Additional work kept live for deeper browsing without crowding the featured slice.
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
                <p className={monoLabelClass}>Archive empty</p>
                <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                  The current launch dataset only contains featured projects. Archive expansion can land in a follow-up phase without rewiring this page.
                </p>
              </article>
            )}
          </section>
        </div>
      ) : null}
    </section>
  )
}

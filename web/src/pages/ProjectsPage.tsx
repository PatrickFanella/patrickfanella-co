import { useMemo, useState } from 'react'

import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { compactButtonClass, monoLabelClass, pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass, surfaceCardClass } from '../lib/styles'
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
  const projectsError = getErrorMessage(error, 'Please try again in a moment.')

  return (
    <section className={`${pageSectionClass} pt-4`}>
      <Seo
        description="Browse Patrick Fanella's production case studies by stack, problem domain, and shipped system design."
        path="/projects"
        title="Projects"
      />
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)] md:items-start border-b-2 border-stroke pb-12 mb-10">
        <div>
          <SectionLabel>Project Archive</SectionLabel>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>
            Projects
          </h1>
          <p className={pageIntroClass}>
            Each project below is a production system: built, deployed, and documented. Filter by stack, then open any case study for the architecture decisions, trade-offs, and lessons behind the build.
          </p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
          <p className={monoLabelClass}>Filter by</p>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
            Explore projects by language, framework, or problem domain. Each card links to the full case study.
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
            <button
              className={secondaryButtonClass}
              onClick={retry}
              type="button"
            >
              Try Again
            </button>
          )}
          description={projectsError}
          label="Unavailable"
          role="alert"
          title="The project index couldn't be loaded."
        />
      ) : null}

      {status === 'success' && projects.length === 0 ? (
        <RouteState
          description="The portfolio is online, but no projects have been published yet."
          label="No projects yet"
          title="The archive is empty."
        />
      ) : null}

      {status === 'success' && projects.length > 0 ? (
        <div className="grid gap-14">
          <section className={`${surfaceCardClass} grid gap-5 bg-panel p-6`} aria-label="Project filters">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <p className={monoLabelClass}>Filters</p>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  Showing {visibleProjects.length} of {projects.length} projects{activeTag ? ` for ${activeTag}.` : '.'}
                </p>
              </div>
              {activeTag ? (
                <button
                  className={[
                    compactButtonClass,
                    'text-[0.72rem] font-mono border-stroke bg-surface text-heading hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-purple hover:text-accent-purple hover:shadow-brutal-purple focus-visible:ring-accent-purple',
                  ].join(' ')}
                  onClick={() => setActiveTag(null)}
                  type="button"
                >
                  Clear Filter
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                aria-pressed={activeTag === null}
                className={[
                  compactButtonClass,
                  'text-[0.72rem] font-mono',
                  activeTag === null
                    ? 'border-accent-green bg-accent-green text-paper'
                    : 'border-stroke bg-surface text-heading hover:border-accent-purple hover:text-accent-purple focus-visible:ring-accent-purple',
                ].join(' ')}
                onClick={() => setActiveTag(null)}
                type="button"
              >
                All
              </button>
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  aria-pressed={activeTag === tag}
                  className={[
                    compactButtonClass,
                    'text-[0.72rem] font-mono',
                    activeTag === tag
                      ? 'border-accent-green bg-accent-green text-paper'
                      : 'border-stroke bg-surface text-heading hover:border-accent-purple hover:text-accent-purple focus-visible:ring-accent-purple',
                  ].join(' ')}
                  onClick={() => setActiveTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {visibleProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visibleProjects.map((project, index) => (
                <ProjectCard key={project.slug} order={index + 1} project={project} />
              ))}
            </div>
          ) : (
              <RouteState
                actions={(
                  <button
                    className={[
                      compactButtonClass,
                      'text-[0.72rem] font-mono border-stroke bg-surface text-heading hover:border-accent-purple hover:text-accent-purple focus-visible:ring-accent-purple',
                    ].join(' ')}
                    onClick={() => setActiveTag(null)}
                    type="button"
                  >
                    Clear Filter
                  </button>
                )}
                description={`No projects match the ${activeTag} filter. Try another tag or clear the filter.`}
                label="No matches"
                title="That filter came up empty."
              />
          )}
        </div>
      ) : null}
    </section>
  )
}

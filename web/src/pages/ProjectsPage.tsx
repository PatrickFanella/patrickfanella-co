import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass } from '../lib/styles'
import { flagshipLegendTechs } from '../lib/techColors'
import { useProjects } from '../lib/useProjects'

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const flagships = projects.filter((project) => project.classification === 'flagship')

  return (
    <section className={`${pageSectionClass} pt-3`}>
      <Seo
        description="Explore Patrick Fanella's selected backend, product, community, graph, and workflow projects across Go, Python, TypeScript, React, PostgreSQL, Unity, and distributed systems."
        image="/assets/social/patrick-fanella-portfolio-1200x630.png"
        path="/projects"
        title="Projects — Senior Full-Stack & Backend Engineer"
      />
      <div className="mb-10 border-b-2 border-stroke pb-9">
        <SectionLabel>Selected work</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5 uppercase`}>Projects</h1>
        <p className={pageIntroClass}>Selected projects showing how I design backend systems, turn them into usable products, and carry them through testing and deployment.</p>
      </div>

      {status === 'loading' ? <RouteState ariaLive="polite" description="Loading the selected case studies." label="Loading" role="status" title="Project index incoming." /> : null}
      {status === 'error' ? (
        <RouteState actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>} description={getErrorMessage(error, 'Please try again in a moment.')} label="Unavailable" role="alert" title="The project index could not be loaded." />
      ) : null}
      {status === 'success' && flagships.length === 0 ? <RouteState description="No flagship case studies are currently published." label="No projects" title="The selected work index is empty." /> : null}
      {status === 'success' && flagships.length > 0 ? (
        <div>
          <div className="mb-8 border-2 border-stroke bg-surface p-6 shadow-brutal">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-stroke pb-3 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-accent-green">
                    Stack Legend
                  </p>
                  <p className="mt-1 font-mono text-[0.72rem] text-ink-soft">
                    Distinct color identifiers for technologies across flagship case studies. Hover pips on any project card for stack inspection.
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[0.68rem] font-bold uppercase tracking-[0.15em] text-ink-soft">
                  {flagshipLegendTechs.length} Technologies
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
                {flagshipLegendTechs.map(({ name, color }) => (
                  <div key={name} className="flex items-center gap-2 font-mono text-[0.75rem] text-ink">
                    <span className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
                    <span className="truncate font-medium whitespace-nowrap" title={name}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {flagships.map((project, index) => (
              <ProjectCard key={project.slug} order={index + 1} project={project} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass } from '../lib/styles'
import { coreLegendTechs } from '../lib/techColors'
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
          <div className="mb-8 border-2 border-stroke bg-surface p-5 shadow-brutal">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-accent-green">
                  Stack Legend
                </p>
                <p className="mt-1 font-mono text-[0.72rem] text-ink-soft">
                  Color pips indicate core technologies. Hover pips on any project card for full stack inspection.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-3 xl:grid-cols-6">
                {coreLegendTechs.map(({ name, color }) => (
                  <div key={name} className="flex items-center gap-2 font-mono text-[0.78rem] text-ink">
                    <span className={`h-2.5 w-2.5 shrink-0 ${color}`} aria-hidden="true" />
                    <span className="font-medium whitespace-nowrap">{name}</span>
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

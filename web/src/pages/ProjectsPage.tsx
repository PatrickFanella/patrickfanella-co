import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass } from '../lib/styles'
import { flagshipLegendTechs } from '../lib/techColors'
import { useProjects } from '../lib/useProjects'

const toolSlugs = [
  'switchyard',
  'blacktower',
  'tmux-plugins',
  'obsidian-plugin-metronome-tuner',
  'omarchy-plugin-shelfish',
  'omarchy-plugin-superproductivity',
  'omarchy-plugin-topbar',
] as const

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const flagships = projects.filter(
    (project) =>
      project.classification === 'flagship' &&
      !toolSlugs.some((slug) => slug === project.slug),
  )
  const tools = toolSlugs.flatMap((slug) => {
    const project = projects.find((candidate) => candidate.slug === slug)
    return project ? [project] : []
  })

  return (
    <section className={`${pageSectionClass} pt-3`}>
      <Seo
        description="Case studies and developer tools by senior full-stack and backend engineer Patrick Fanella."
        image="/assets/social/patrick-fanella-portfolio-1200x630.png"
        path="/projects"
        title="Projects | Senior full-stack and backend engineer"
      />
      <div className="mb-10 border-b-2 border-stroke pb-9">
        <SectionLabel>Selected work</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5 uppercase`}>Projects</h1>
        <p className={pageIntroClass}>Selected projects showing how I design backend systems, turn them into usable products, and carry them through testing and deployment.</p>
      </div>

      {status === 'loading' ? <RouteState ariaLive="polite" description="Loading projects." label="Loading" role="status" title="Loading projects." /> : null}
      {status === 'error' ? (
        <RouteState actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>} description={getErrorMessage(error, 'Please try again in a moment.')} label="Unavailable" role="alert" title="The project index could not be loaded." />
      ) : null}
      {status === 'success' && flagships.length === 0 && tools.length === 0 ? <RouteState description="No case studies or tools are published yet." label="No projects" title="No projects found." /> : null}
      {status === 'success' && flagships.length > 0 ? (
        <div>
          <div className="mb-8 border-2 border-stroke bg-surface p-6 shadow-brutal">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1 border-b border-stroke pb-3 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <p className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-accent-green">
                    Stack legend
                  </p>
                  <p className="mt-1 font-mono text-[0.72rem] text-ink-soft">
                    The legend names the technologies used in the case studies, and card colors match it.
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[0.68rem] font-bold uppercase tracking-[0.15em] text-ink-soft">
                  {flagshipLegendTechs.length} technologies
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

      {status === 'success' && tools.length > 0 ? (
        <section className="mt-16 border-t-2 border-stroke pt-10" aria-labelledby="tools-heading">
          <div className="mb-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] sm:items-end">
            <div>
              <SectionLabel>Developer tools</SectionLabel>
              <h2 id="tools-heading" className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.88] tracking-[-0.055em] text-heading uppercase">
                Tools
              </h2>
            </div>
            <p className="max-w-[42ch] text-[1.05rem] leading-relaxed text-ink-soft sm:justify-self-end">
              Tools, plugins, and integrations I built for development, automation, and desktop workflows.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((project, index) => (
              <ProjectCard
                key={project.slug}
                linkToRepository={project.slug !== 'switchyard'}
                order={index + 1}
                project={project}
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}

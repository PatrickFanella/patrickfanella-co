import { useState } from 'react'

import { ProjectCard } from '../components/ProjectCard'
import { LoadingState, RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass } from '../lib/styles'
import { flagshipLegendTechs } from '../lib/techColors'
import { useProjects } from '../lib/useProjects'

const toolSlugs = [
  'switchyard',
  'blacktower',
  'tmux-popups',
  'obsidian-plugin-metronome-tuner',
  'omarchy-plugin-shelfish',
  'omarchy-plugin-superproductivity',
  'omarchy-monitor-bar',
] as const

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const flagships = projects.filter(
    (project) =>
      project.classification === 'flagship' &&
      !toolSlugs.some((slug) => slug === project.slug),
  )
  const tools = toolSlugs.flatMap((slug) => {
    const project = projects.find((candidate) => candidate.slug === slug)
    return project ? [project] : []
  })
  const visibleFlagships = selectedTech
    ? flagships.filter((project) => project.stack.includes(selectedTech))
    : flagships
  const visibleTools = selectedTech
    ? tools.filter((project) => project.stack.includes(selectedTech))
    : tools
  const visibleProjectCount = visibleFlagships.length + visibleTools.length

  const toggleTech = (tech: string) => {
    setSelectedTech((current) => current === tech ? null : tech)
  }

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
        <p className={pageIntroClass}>The longer write-ups. Some of these run in production, some are demos or still in development, and each card says which.</p>
      </div>

      {status === 'loading' ? <LoadingState description="Loading projects." title="Loading projects." /> : null}
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
                    The legend names the technologies used in the case studies, and card colors match it. Select one to filter the projects.
                  </p>
                </div>
                <span className="shrink-0 font-mono text-[0.68rem] font-bold uppercase tracking-[0.15em] text-ink-soft">
                  {flagshipLegendTechs.length} technologies
                </span>
              </div>
              <div aria-label="Filter projects by technology" className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7" role="group">
                {flagshipLegendTechs.map(({ name, color }) => (
                  <button
                    key={name}
                    aria-pressed={selectedTech === name}
                    className={`flex min-w-0 items-center gap-2 border-2 px-2 py-2 text-left font-mono text-[0.75rem] transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${selectedTech === name
                      ? '-translate-x-0.5 -translate-y-0.5 border-heading bg-panel text-heading shadow-brutal-green'
                      : 'border-transparent text-ink hover:border-stroke hover:bg-paper'
                    }`}
                    onClick={() => toggleTech(name)}
                    type="button"
                  >
                    <span className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
                    <span className="truncate font-medium whitespace-nowrap" title={name}>{name}</span>
                  </button>
                ))}
              </div>
              {selectedTech ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stroke pt-3">
                  <p aria-live="polite" className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.1em] text-heading" role="status">
                    {visibleProjectCount} {visibleProjectCount === 1 ? 'project' : 'projects'} using {selectedTech}
                  </p>
                  <button
                    className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.12em] text-accent-green underline decoration-2 underline-offset-4 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
                    onClick={() => setSelectedTech(null)}
                    type="button"
                  >
                    Clear filter
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {visibleFlagships.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleFlagships.map((project, index) => (
                <ProjectCard key={project.slug} headingLevel="h2" order={index + 1} project={project} />
              ))}
            </div>
          ) : selectedTech && visibleTools.length === 0 ? (
            <RouteState
              actions={<button className={secondaryButtonClass} onClick={() => setSelectedTech(null)} type="button">Clear filter</button>}
              description={`No published projects use ${selectedTech}. Choose another technology or clear the filter.`}
              headingLevel="h2"
              label="No matches"
              title="No projects found."
            />
          ) : null}
        </div>
      ) : null}

      {status === 'success' && visibleTools.length > 0 ? (
        <section className="mt-16 border-t-2 border-stroke pt-10" aria-labelledby="tools-heading">
          <div className="mb-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.7fr)] sm:items-end">
            <div>
              <SectionLabel>Developer tools</SectionLabel>
              <h2 id="tools-heading" className="mt-4 font-display text-[clamp(2.5rem,7vw,5rem)] font-bold leading-[0.88] tracking-[-0.055em] text-heading uppercase">
                Tools
              </h2>
            </div>
            <p className="max-w-[42ch] text-[1.05rem] leading-relaxed text-ink-soft sm:justify-self-end">
              Smaller things I built for my own terminal, notes and desktop: tmux popups, Obsidian and Omarchy plugins, and two automation projects.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleTools.map((project, index) => (
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

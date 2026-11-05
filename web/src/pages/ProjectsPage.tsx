import { useState } from 'react'

import { ProjectCard } from '../components/ProjectCard'
import { LoadingState, RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

const toolSlugs = ['subsets', 'tmux-popups', 'twitchdl']

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const flagships = projects.filter((project) => project.classification === 'flagship' && !toolSlugs.includes(project.slug))
  const tools = toolSlugs.flatMap((slug) => projects.filter((project) => project.slug === slug))
  const technologies = [...new Set([...flagships, ...tools].flatMap((project) => project.stack))].sort()
  const visibleFlagships = selectedTech ? flagships.filter((project) => project.stack.includes(selectedTech)) : flagships
  const visibleTools = selectedTech ? tools.filter((project) => project.stack.includes(selectedTech)) : tools
  const visibleProjectCount = visibleFlagships.length + visibleTools.length

  return (
    <section className={pageSectionClass}>
      <Seo description="Case studies and developer tools by senior full-stack and backend engineer Patrick Fanella." image="/assets/social/patrick-fanella-portfolio-1200x630.png" path="/projects" title="Projects | Senior full-stack and backend engineer" />
      <div className="page-intro">
        <SectionLabel>Selected work</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5`}>Projects</h1>
        <p className={pageIntroClass}>From a search query to a running service. These case studies cover the interfaces, data pipelines, and operational decisions behind the work. Each project names its delivery status.</p>
      </div>
      {status === 'loading' ? <LoadingState description="Loading projects." title="Loading projects." /> : null}
      {status === 'error' ? <RouteState actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>} description={getErrorMessage(error, 'Please try again in a moment.')} label="Unavailable" role="alert" title="The project index could not be loaded." /> : null}
      {status === 'success' && flagships.length === 0 && tools.length === 0 ? <RouteState description="No case studies or tools are published yet." label="No projects" title="No projects found." /> : null}
      {status === 'success' && technologies.length > 0 ? (
        <div className="project-filters">
          <label className="text-sm font-medium text-heading" htmlFor="technology-filter">Filter by technology</label>
          <select className="min-h-11 max-w-full border border-stroke bg-surface px-3 py-2 text-sm text-heading" id="technology-filter" onChange={(event) => setSelectedTech(event.target.value || null)} value={selectedTech || ''}>
            <option value="">All technologies</option>
            {technologies.map((tech) => <option key={tech} value={tech}>{tech}</option>)}
          </select>
          <p aria-live="polite" className="text-sm text-ink-soft sm:ml-auto" role="status">
            {visibleProjectCount} {visibleProjectCount === 1 ? 'project' : 'projects'}{selectedTech ? ` using ${selectedTech}` : ''}
          </p>
          {selectedTech ? <button className="text-sm text-heading underline underline-offset-4" onClick={() => setSelectedTech(null)} type="button">Clear filter</button> : null}
        </div>
      ) : null}
      {status === 'success' ? (
        <>
          <div>{visibleFlagships.map((project) => <ProjectCard key={project.slug} headingLevel="h2" project={project} />)}</div>
          {selectedTech && visibleProjectCount === 0 ? <RouteState actions={<button className={secondaryButtonClass} onClick={() => setSelectedTech(null)} type="button">Clear filter</button>} description={`No published projects use ${selectedTech}. Choose another technology or clear the filter.`} label="No matches" title="No projects found." /> : null}
          {visibleTools.length > 0 ? (
            <section className="mt-16" aria-labelledby="tools-heading">
              <SectionLabel>Smaller, focused work</SectionLabel>
              <h2 className="mt-5 font-display text-4xl font-semibold tracking-[-0.04em] text-heading" id="tools-heading">Tools</h2>
              <p className={`${pageIntroClass} mb-8`}>Utilities for managing agent skills, keeping terminal bindings consistent, and capturing public media. The source includes installation and usage notes.</p>
              <div className="tool-list">{visibleTools.map((project) => <ProjectCard key={project.slug} linkToRepository project={project} />)}</div>
            </section>
          ) : null}
        </>
      ) : null}
    </section>
  )
}

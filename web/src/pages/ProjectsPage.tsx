import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { ProjectTile } from '../components/ProjectTile'
import { LoadingState, RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

const categoryOrder = ['Community & Media', 'Archives & Research', 'Tools & Workflows', 'AT Protocol & Events', 'Games & Creative']

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const [selectedTech, setSelectedTech] = useState<string | null>(null)
  const location = useLocation()
  const toolsRef = useRef<HTMLElement>(null)
  const selected = projects.filter((project) => project.selected || project.classification === 'flagship')
  const technologies = [...new Set(selected.flatMap((project) => project.stack))].sort()
  const visible = selectedTech ? selected.filter((project) => project.stack.includes(selectedTech)) : selected
  const featured = visible.filter((project) => project.featured)
  const remaining = visible.filter((project) => !project.featured)
  const categories = [...categoryOrder, ...new Set(visible.map((project) => project.category).filter((category) => !categoryOrder.includes(category)))]
  const archive = projects.filter((project) => !project.selected && project.classification !== 'flagship')

  useEffect(() => {
    if (status === 'success' && location.hash === '#tools') {
      toolsRef.current?.scrollIntoView?.()
      toolsRef.current?.focus({ preventScroll: true })
    }
  }, [location.hash, status])

  return (
    <section className={pageSectionClass}>
      <Seo description="Applications, archives, research, creative projects and developer tools by Patrick Fanella." image="/assets/social/patrick-fanella-portfolio-1200x630.png" path="/projects" title="Projects | Senior full-stack and backend engineer" />
      <div className="page-intro">
        <SectionLabel>Selected work</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5`}>Projects</h1>
        <p className={pageIntroClass}>Selected engineering work across media search, community tools, and creative software. Each project names its delivery status and explains the problem, my contribution, and the technical decisions behind it.</p>
      </div>
      <p className="mb-8 text-ink-soft">Earlier work and smaller experiments are in the <Link className="text-accent-green underline underline-offset-4" to="/archive">project archive</Link>.</p>
      {status === 'loading' ? <LoadingState description="Loading projects." title="Loading projects." /> : null}
      {status === 'error' ? <RouteState actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>} description={getErrorMessage(error, 'Please try again in a moment.')} label="Unavailable" role="alert" title="The project index could not be loaded." /> : null}
      {status === 'success' && selected.length === 0 ? <RouteState description="No projects are published yet." label="No projects" title="No projects found." /> : null}
      {status === 'success' && technologies.length > 0 ? <div className="project-filters">
        <label className="font-mono text-xs font-bold uppercase tracking-wider text-accent-green" htmlFor="technology-filter">Filter by technology</label>
        <select className="min-h-11 max-w-full border-2 border-stroke bg-surface px-3 py-2 text-sm text-heading" id="technology-filter" onChange={(event) => setSelectedTech(event.target.value || null)} value={selectedTech || ''}>
          <option value="">All technologies</option>
          {technologies.map((tech) => <option key={tech} value={tech}>{tech}</option>)}
        </select>
        <p aria-live="polite" className="text-sm text-ink-soft sm:ml-auto" role="status">{visible.length} {visible.length === 1 ? 'project' : 'projects'}{selectedTech ? ` using ${selectedTech}` : ''}</p>
        {selectedTech ? <button className="text-sm text-heading underline underline-offset-4" onClick={() => setSelectedTech(null)} type="button">Clear filter</button> : null}
      </div> : null}
      {status === 'success' ? <>
        <div className="grid gap-14">
          {featured.length > 0 ? <section aria-labelledby="featured-projects-heading">
            <h2 className="mb-6 font-display text-3xl font-bold uppercase tracking-[-0.03em] text-heading" id="featured-projects-heading">Featured case studies</h2>
            <div className="project-grid">{featured.map((project) => <ProjectTile key={project.slug} project={project} />)}</div>
          </section> : null}
          {categories.map((category) => {
            const entries = remaining.filter((project) => project.category === category)
            if (!entries.length) return null
            const isTools = category === 'Tools & Workflows' || category === 'Developer Tools'
            const id = isTools ? 'tools' : `projects-${category.toLowerCase().replace(/[^a-z]+/g, '-')}`
            return <section aria-labelledby={`${id}-heading`} id={id} key={category} ref={isTools ? toolsRef : undefined} tabIndex={isTools ? -1 : undefined}>
              <h2 className="mb-6 font-display text-3xl font-bold uppercase tracking-[-0.03em] text-heading" id={`${id}-heading`}>{category}</h2>
              <div className="project-grid">{entries.map((project) => <ProjectTile key={project.slug} project={project} />)}</div>
            </section>
          })}
        </div>
        {selectedTech && visible.length === 0 ? <RouteState actions={<button className={secondaryButtonClass} onClick={() => setSelectedTech(null)} type="button">Clear filter</button>} description={`No published projects use ${selectedTech}. Choose another technology or clear the filter.`} label="No matches" title="No projects found." /> : null}
        {!selectedTech && archive.length > 0 ? <section className="mt-16" aria-labelledby="archive-preview-heading">
          <SectionLabel>More from the archive</SectionLabel>
          <h2 className="mt-5 font-display text-3xl font-bold uppercase text-heading" id="archive-preview-heading">Earlier experiments.</h2>
          <div className="project-grid mt-8">{archive.filter((project) => project.kind !== 'tool').slice(0, 3).map((project) => <ProjectTile key={project.slug} project={project} />)}</div>
          <Link className={`${secondaryButtonClass} mt-8`} to="/archive">Browse the full archive</Link>
        </section> : null}
      </> : null}
    </section>
  )
}

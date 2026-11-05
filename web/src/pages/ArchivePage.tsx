import { useEffect, useRef, useState, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'

import { ProjectTile } from '../components/ProjectTile'
import { LoadingState, RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import type { Project } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import { monoLabelClass, pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

const categoryOrder = [
  'Community & Media',
  'Developer Tools',
  'Data & Search',
  'Platform & Infrastructure',
  'AI & Automation',
]

function CategoryGroup({ category, projects, toolsSectionRef }: { category: string; projects: Project[]; toolsSectionRef: RefObject<HTMLElement | null> }) {
  if (projects.length === 0) return null

  const isTools = category === 'Developer Tools' || category === 'Tools & Workflows'
  const headingId = `category-${category.replace(/\s+/g, '-').toLowerCase()}-heading`

  return (
    <section
      className="grid gap-5"
      aria-labelledby={headingId}
      id={isTools ? 'tools' : undefined}
      ref={isTools ? toolsSectionRef : undefined}
      tabIndex={isTools ? -1 : undefined}
    >
      <div>
        <h2 className={monoLabelClass} id={headingId}>{category}</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => <ProjectTile key={project.slug} project={project} />)}
      </div>
    </section>
  )
}

export function ArchivePage() {
  const { projects, status, error, retry } = useProjects()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const toolsSectionRef = useRef<HTMLElement>(null)
  const nonFlagships = projects.filter((project) => project.classification !== 'flagship' && !project.selected)
  const visibleProjects = nonFlagships.filter((project) => `${project.title} ${project.category} ${project.summary} ${project.stack.join(' ')}`.toLowerCase().includes(query.toLowerCase().trim()))

  useEffect(() => {
    if (status !== 'success' || location.hash !== '#tools') return

    const toolsSection = toolsSectionRef.current
    if (!toolsSection) return

    toolsSection.scrollIntoView?.()
    toolsSection.focus({ preventScroll: true })
  }, [location.hash, status])

  const grouped = new Map<string, Project[]>()
  for (const project of visibleProjects) {
    const cat = project.category || 'Other'
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(project)
  }

  const categories = [...categoryOrder, ...[...grouped.keys()].filter((category) => !categoryOrder.includes(category))]

  return (
    <section className={`${pageSectionClass} pt-3`}>
      <Seo description="Prototypes, concepts and small tools by Patrick Fanella, grouped by area." path="/archive" robots="noindex,follow" title="Project archive" />
      <div className="mb-10 border-b border-stroke pb-9">
        <SectionLabel>More work</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5`}>Archive</h1>
        <p className={pageIntroClass}>Experiments, infrastructure, music tools, and earlier builds. Browse by area or find a project by name, purpose, or technology.</p>
      </div>

      {status === 'loading' ? <LoadingState description="Loading additional projects." title="Loading projects." /> : null}
      {status === 'error' ? <RouteState actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>} description={getErrorMessage(error, 'Please try again in a moment.')} label="Unavailable" role="alert" title="The project index could not be loaded." /> : null}
      {status === 'success' ? (
        <>
        <div className="project-filters">
          <label className={monoLabelClass} htmlFor="archive-search">Find a project</label>
          <input className="min-h-11 min-w-0 flex-1 border-2 border-stroke bg-surface px-4 py-2 text-base text-ink" id="archive-search" onChange={(event) => setQuery(event.target.value)} placeholder="Name, purpose, or technology" type="search" value={query} />
          <p className="text-sm text-ink-soft" aria-live="polite">{visibleProjects.length} projects</p>
        </div>
        {visibleProjects.length === 0 ? <RouteState description="Try another name or technology." label="No matches" title="No archive projects match." /> : null}
        <div className="grid gap-14">
          {categories.map((category) => (
            <CategoryGroup key={category} category={category} projects={grouped.get(category) || []} toolsSectionRef={toolsSectionRef} />
          ))}
        </div>
        </>
      ) : null}
    </section>
  )
}

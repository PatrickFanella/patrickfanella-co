import { useMemo } from 'react'

import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { getErrorMessage } from '../lib/errors'
import {
  monoLabelClass,
  pageIntroClass,
  pageSectionClass,
  pageTitleClass,
  secondaryButtonClass,
  surfaceCardClass,
} from '../lib/styles'
import { useProjects } from '../lib/useProjects'

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const flagships = projects.filter((project) => project.classification === 'flagship')

  return (
    <section className={`${pageSectionClass} pt-4`}>
      <Seo
        description="Explore Patrick Fanella's selected backend, product, community, graph, and workflow projects across Go, Python, TypeScript, React, PostgreSQL, Unity, and distributed systems."
        image="/assets/social/patrick-fanella-portfolio-1200x630.png"
        path="/projects"
        title="Projects"
      />
      <div className="mb-10 border-b-2 border-stroke pb-9">
        <SectionLabel>Selected work</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5 uppercase`}>Projects</h1>
        <p className={pageIntroClass}>Selected projects showing how I design backend systems, turn them into usable products, and carry them through testing and deployment.</p>
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
      {status === 'success' && flagships.length === 0 ? <RouteState description="No flagship case studies are currently published." label="No projects" title="The selected work index is empty." /> : null}
      {status === 'success' && flagships.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {flagships.map((project, index) => <ProjectCard key={project.slug} order={index + 1} project={project} />)}
        </div>
      ) : null}
    </section>
  )
}

import { Link } from 'react-router-dom'

import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import type { Project } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import { monoLabelClass, pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass, surfaceCardClass, textLinkClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

const categoryOrder = [
  'AI & Automation',
  'Data & Search',
  'Community & Media',
  'Platform & Infrastructure',
  'Developer Tools',
]

function CategoryGroup({ category, projects }: { category: string; projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <section className="grid gap-5" aria-labelledby={`category-${category.replace(/\s+/g, '-').toLowerCase()}-heading`}>
      <div>
        <h2 className={monoLabelClass} id={`category-${category.replace(/\s+/g, '-').toLowerCase()}-heading`}>{category}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article className={`${surfaceCardClass} grid gap-4 p-5`} key={project.slug}>
            <h3 className="font-display text-2xl font-bold text-heading">{project.title}</h3>
            <p className="text-sm leading-relaxed text-ink-soft">{project.summary}</p>
            <div className="flex flex-wrap gap-4">
              {project.repoUrl ? <a className={textLinkClass} href={project.repoUrl} rel="noreferrer" target="_blank">Repository ↗</a> : null}
              <Link className={textLinkClass} to={`/projects/${project.slug}`}>View project →</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function ArchivePage() {
  const { projects, status, error, retry } = useProjects()
  const nonFlagships = projects.filter((project) => project.classification !== 'flagship')

  const grouped = new Map<string, Project[]>()
  for (const project of nonFlagships) {
    const cat = project.category || 'Other'
    if (!grouped.has(cat)) grouped.set(cat, [])
    grouped.get(cat)!.push(project)
  }

  return (
    <section className={`${pageSectionClass} pt-3`}>
      <Seo description="Every project Patrick Fanella has built, organized by domain." path="/archive" robots="noindex,follow" title="All Projects" />
      <div className="mb-10 border-b-2 border-stroke pb-9">
        <SectionLabel>Supporting evidence</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5 uppercase`}>All projects</h1>
        <p className={pageIntroClass}>Every project I've built, organized by domain. Flagship case studies are on the Projects page.</p>
      </div>

      {status === 'loading' ? <RouteState ariaLive="polite" description="Loading all projects." label="Loading" role="status" title="Projects incoming." /> : null}
      {status === 'error' ? <RouteState actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>} description={getErrorMessage(error, 'Please try again in a moment.')} label="Unavailable" role="alert" title="The project index could not be loaded." /> : null}
      {status === 'success' ? (
        <div className="grid gap-14">
          {categoryOrder.map((category) => (
            <CategoryGroup key={category} category={category} projects={grouped.get(category) || []} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
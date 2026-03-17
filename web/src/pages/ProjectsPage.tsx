import { ProjectCard } from '../components/ProjectCard'
import { SectionLabel } from '../components/SectionLabel'
import { projects } from '../data/projects'
import { monoLabelClass, pageIntroClass, pageSectionClass, pageTitleClass, surfaceCardClass } from '../lib/styles'

export function ProjectsPage() {
  return (
    <section className={`${pageSectionClass} pt-4`}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)] md:items-start border-b-2 border-stroke pb-12 mb-10">
        <div>
          <SectionLabel>Database query</SectionLabel>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>
            Project master log.
          </h1>
          <p className={pageIntroClass}>
            Chronological registry of delivered frontends, APIs, plugins, and architectures spanning the current phase of practice. Filter by relevance when scanning.
          </p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
          <p className={monoLabelClass}>Protocol</p>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
            Scan for stacks or problems aligned with your current scope. Open individual entries for topology breakdowns, explicit technical choices, and hard outcome metrics.
          </p>
        </aside>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} order={index + 1} project={project} />
        ))}
      </div>
    </section>
  )
}

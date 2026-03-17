import { ProjectCard } from '../components/ProjectCard'
import { SectionLabel } from '../components/SectionLabel'
import { projects } from '../data/projects'
import { pageIntroClass, pageSectionClass, pageTitleClass } from '../lib/styles'

export function ProjectsPage() {
  return (
    <section className={pageSectionClass}>
      <SectionLabel>Portfolio</SectionLabel>
      <h1 className={`${pageTitleClass} mt-3`}>A growing archive of project work.</h1>
      <p className={pageIntroClass}>
        Replace these starter entries with your strongest builds and expand each one
        into a proper case study as you refine the site.
      </p>

      <div className="mt-6 grid gap-4.5 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}

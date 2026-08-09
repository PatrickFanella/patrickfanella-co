import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { pageIntroClass, pageSectionClass, pageTitleClass, secondaryButtonClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

export function ProjectsPage() {
  const { projects, status, error, retry } = useProjects()
  const flagships = projects.filter((project) => project.classification === 'flagship').slice(0, 3)

  return (
    <section className={`${pageSectionClass} pt-3`}>
      <Seo
        description="Three focused case studies from Patrick Fanella: Clpr, Patchwork, and HasanAra."
        image="/assets/social/patrick-fanella-portfolio-1200x630.png"
        path="/projects"
        title="Projects"
      />
      <div className="mb-10 border-b-2 border-stroke pb-9">
        <SectionLabel>Selected work</SectionLabel>
        <h1 className={`${pageTitleClass} mt-5 uppercase`}>Projects</h1>
        <p className={pageIntroClass}>Three case studies chosen for relevance to senior full-stack and backend roles. Each states its delivery status and separates implemented evidence from work in progress.</p>
      </div>

      {status === 'loading' ? <RouteState ariaLive="polite" description="Loading the selected case studies." label="Loading" role="status" title="Project index incoming." /> : null}
      {status === 'error' ? (
        <RouteState actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>} description={getErrorMessage(error, 'Please try again in a moment.')} label="Unavailable" role="alert" title="The project index could not be loaded." />
      ) : null}
      {status === 'success' && flagships.length === 0 ? <RouteState description="No flagship case studies are currently published." label="No projects" title="The selected work index is empty." /> : null}
      {status === 'success' && flagships.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {flagships.map((project, index) => <ProjectCard key={project.slug} order={index + 1} project={project} />)}
        </div>
      ) : null}
    </section>
  )
}

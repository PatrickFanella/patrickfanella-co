import { Link } from 'react-router-dom'

import { ProjectCard } from '../components/ProjectCard'
import { LoadingState, RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { getSiteUrl } from '../lib/site'
import { primaryButtonClass, secondaryButtonClass, textLinkClass } from '../lib/styles'
import { useProjects } from '../lib/useProjects'

const focusAreas = ['Backend systems', 'Accessible product interfaces', 'Testing and deployment', 'Production operations']

export function HomePage() {
  const { projects, status, error, retry } = useProjects()
  const flagships = projects.filter((project) => project.featured)

  return (
    <>
      <Seo
        image="/assets/social/patrick-fanella-portfolio-1200x630.png"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          jobTitle: 'Senior Full-Stack and Backend Engineer',
          knowsAbout: focusAreas,
          name: 'Patrick Fanella',
          email: 'mailto:fanella.patrick@gmail.com',
          image: `${getSiteUrl()}/assets/social/patrick-fanella-portfolio-1200x630.png`,
          homeLocation: {
            '@type': 'Place',
            name: 'Chicago, Illinois',
          },
          sameAs: ['https://github.com/PatrickFanella', 'https://git.subcult.tv/PatrickFanella', 'https://linkedin.com/in/patrick-fanella'],
          url: getSiteUrl(),
        }}
      />

      <section className="home-intro">
        <div>
          <SectionLabel>Senior full-stack / backend engineer</SectionLabel>
          <h1 className="home-title"><span className="block">I write the API,</span> <span className="block text-accent-pink">the interface,</span> <span className="block text-accent-green">and the runbook.</span></h1>
          <p className="mt-6 max-w-[51ch] text-lg leading-relaxed text-ink-soft">
            Go and Python on PostgreSQL, with React in front. I build the product, test it, deploy it, and stay on to run it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link className={primaryButtonClass} to="/projects">Read the case studies</Link>
            <Link className={textLinkClass} to="/resume">See my resume</Link>
          </div>
        </div>
        <aside className="home-note" aria-label="Availability and work areas">
          <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-accent-green"><span aria-hidden="true" className="h-2 w-2 bg-accent-green" />Actively interviewing</p>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-heading">Chicago or remote</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">Looking for a senior engineering role with ownership from the data model to the running service.</p>
          <ul className="mt-6 grid list-none gap-2 p-0 text-sm text-ink">
            {focusAreas.map((area) => <li className="border border-stroke bg-surface px-3 py-2" key={area}>{area}</li>)}
          </ul>
          <Link className={`${textLinkClass} mt-7`} to="/contact">Tell me about a role</Link>
        </aside>
      </section>

      <section className="py-12" aria-labelledby="featured-heading">
        <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <SectionLabel>Case studies</SectionLabel>
            <h2 className="mt-4 font-display text-[clamp(2.3rem,5vw,3.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-heading" id="featured-heading">
              Selected work.
            </h2>
          </div>
          <p className="max-w-[38ch] text-ink-soft md:justify-self-end md:text-right">Three ways into the work: clip discovery, a searchable broadcast archive, and a browser video editor.</p>
        </div>

        {status === 'loading' ? <LoadingState description="Loading case studies." title="Loading case studies." /> : null}
        {status === 'error' ? (
          <RouteState
            actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>}
            description={getErrorMessage(error, 'The case studies are unavailable right now.')}
            label="Unavailable"
            role="alert"
            title="Case studies could not be loaded."
          />
        ) : null}
        {status === 'success' && flagships.length === 0 ? <RouteState description="Case studies will appear here when they are published." label="No projects" title="No featured projects yet." /> : null}
        {status === 'success' && flagships.length > 0 ? (
          <>
            <div>
              {flagships.map((project) => <ProjectCard key={project.slug} project={project} />)}
            </div>
            <div className="mt-8">
              <Link className={secondaryButtonClass} to="/projects">Read all case studies</Link>
            </div>
          </>
        ) : null}

      </section>
    </>
  )
}

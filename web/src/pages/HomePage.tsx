import { Link } from 'react-router-dom'

import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { getSiteUrl } from '../lib/site'
import { monoLabelClass, primaryButtonClass, secondaryButtonClass, surfaceCardClass, textLinkClass } from '../lib/styles'
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

      <section className="grid gap-8 border-b-2 border-stroke pb-12 pt-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-end">
        <div>
          <SectionLabel>Senior full-stack / backend</SectionLabel>
          <h1 className="mt-5 max-w-[13ch] font-display text-[clamp(3.2rem,8vw,7.6rem)] font-bold uppercase leading-[0.84] tracking-[-0.055em] text-heading">
            <span className="block">Backend depth.</span>{' '}
            <span className="block text-accent-pink">Usable products.</span>{' '}
            <span className="block text-accent-green">Shipped end to end.</span>
          </h1>
          <p className="mt-6 max-w-[48ch] text-[1.08rem] leading-relaxed text-ink-soft sm:text-[1.2rem]">
            I design backend systems, turn them into accessible product interfaces, and own testing, deployment, and operations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={primaryButtonClass} to="/contact">Tell me about a role</Link>
            <Link className={secondaryButtonClass} to="/projects">Read the case studies</Link>
            <Link className={textLinkClass} to="/resume">Download my resume</Link>
          </div>
        </div>

        <aside className={`${surfaceCardClass} bg-panel p-6`} aria-label="Availability and work areas">
          <p className={monoLabelClass}>Actively interviewing</p>
          <p className="mt-4 font-display text-2xl font-bold leading-tight text-heading">Chicago or remote</p>
          <ul className="mt-5 grid list-none gap-2 p-0">
            {focusAreas.map((area) => <li className="border-2 border-stroke bg-surface px-3 pt-[calc(0.5rem+0.5px)] pb-[calc(0.5rem-0.5px)] font-mono text-xs uppercase tracking-[0.12em]" key={area}>{area}</li>)}
          </ul>
          <a className={`${textLinkClass} mt-5`} href="mailto:fanella.patrick@gmail.com">fanella.patrick@gmail.com</a>
        </aside>
      </section>

      <section className="py-12" aria-labelledby="featured-heading">
        <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <SectionLabel>Case studies</SectionLabel>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-heading" id="featured-heading">
              How I work.
            </h2>
          </div>
          <p className="max-w-[38ch] text-ink-soft md:justify-self-end md:text-right">Each case study covers the problem, my ownership, architecture decisions, and what shipped.</p>
        </div>

        {status === 'loading' ? <RouteState ariaLive="polite" description="Loading case studies." label="Loading" role="status" title="Loading case studies." /> : null}
        {status === 'error' ? (
          <RouteState
            actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>}
            description={getErrorMessage(error, 'The case studies are unavailable right now.')}
            label="Unavailable"
            role="alert"
            title="Case studies could not be loaded."
          />
        ) : null}
        {status === 'success' ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {flagships.map((project, index) => <ProjectCard key={project.slug} order={index + 1} project={project} />)}
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

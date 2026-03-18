import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { ProjectCard } from '../components/ProjectCard'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import { getSiteUrl } from '../lib/site'
import {
  monoLabelClass,
  pageIntroClass,
  primaryButtonClass,
  secondaryButtonClass,
  surfaceCardClass,
  textLinkClass,
} from '../lib/styles'
import { useProjects } from '../lib/useProjects'

const focusAreas = ['Go / Backend Architecture', 'React / TypeScript Interfaces', 'AI, Search, and Data Pipelines', 'Infrastructure / DevOps']

const workingPrinciples = [
  {
    title: 'Shipped products over side projects',
    description:
      'Production forces decisions that prototypes never do. Every project here has been deployed, monitored, and used. The case studies capture the constraints that shaped each build, not just the final architecture.',
  },
  {
    title: 'Full stack means the whole stack',
    description:
      'From Solidity smart contracts to Kubernetes orchestration, GPU worker queues to browser extensions. Real products don\u2019t respect stack boundaries, and neither does this work.',
  },
  {
    title: 'Production engineering is not optional',
    description:
      'Load testing, security audits, observability, and horizontal scaling are part of the build, not items for a post-launch backlog. The projects here ship with Prometheus dashboards, k6 benchmarks, and Slither contract audits as standard.',
  },
]

export function HomePage() {
  const prefersReducedMotion = useReducedMotion()
  const { projects, status, error, retry } = useProjects()
  const featuredProjects = projects.filter((project) => project.featured)

  const featuredMessage = getErrorMessage(
    error,
    'Featured case studies are temporarily unavailable.',
  )
  const motionProps = prefersReducedMotion
    ? {}
    : {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2, ease: 'linear' as const },
    }
  const fadeInProps = prefersReducedMotion
    ? {}
    : {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2, delay: 0.1, ease: 'linear' as const },
    }
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    jobTitle: 'Full Stack Developer',
    knowsAbout: focusAreas,
    name: 'Patrick Fanella',
    sameAs: ['https://github.com/PatrickFanella'],
    url: getSiteUrl(),
  }

  return (
    <>
      <Seo structuredData={structuredData} />
      <section className="border-b-2 border-stroke pb-16 pt-8">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <div className="flex flex-col justify-center">
            <SectionLabel>Index / 2026</SectionLabel>

            <motion.h1
              className="mt-8 font-display text-[clamp(4rem,8vw,8rem)] font-bold leading-[0.85] tracking-[-0.05em] text-heading uppercase"
              {...motionProps}
            >
              Backend<span className="text-accent-green"> depth.</span> Frontend<span className="text-accent-teal"> clarity.</span> Production<span className="text-accent-pink"> throughout.</span>
            </motion.h1>

            <motion.p
              className={`${pageIntroClass} max-w-[46ch] mt-8 text-[1.2rem]`}
              {...fadeInProps}
            >
              I'm <span className="text-accent-pink">Patrick Fanella</span>. I build AI agent platforms, GPU transcription pipelines, 3D graph visualization tools, and on-chain provenance systems: production software across Go, React, Python, and TypeScript, from first commit to monitored deployment.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              {...(prefersReducedMotion
                ? {}
                : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: { duration: 0.2, delay: 0.15, ease: 'linear' as const },
                })}
            >
              <Link className={primaryButtonClass} to="/projects">
                View Case Studies
              </Link>
              <Link className={secondaryButtonClass} to="/contact">
                Get in Touch
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-6 content-start">
            <aside className={`${surfaceCardClass} bg-panel p-8`} aria-label="Operating philosophy">
              <p className={monoLabelClass}>Approach</p>
              <p className="mt-6 font-display text-[2.2rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
                Complex systems, made clear.
              </p>
              <p className="mt-4 text-ink-soft leading-relaxed">
                The interesting problems live where systems meet: search pipelines feeding frontends, AI agents coordinating through WebSockets, smart contracts verified by browser extensions. I like building at those seams.
              </p>
            </aside>

            <aside className={`${surfaceCardClass} p-8`} aria-label="Core competences">
              <p className={monoLabelClass}>Core strengths</p>
              <ul className="mt-6 grid list-none gap-3 p-0" aria-label="Primary technology focus">
                {focusAreas.map((item) => (
                  <li
                    key={item}
                    className="border-2 border-stroke bg-surface px-4 py-3 font-mono text-[0.8rem] uppercase tracking-[0.15em] text-heading transition-colors hover:border-accent-pink hover:bg-accent-pink hover:text-paper"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-stroke pb-16 pt-16">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,auto)] lg:items-end">
          <div>
            <SectionLabel>Featured Work</SectionLabel>
            <h2 className="mt-6 max-w-[15ch] font-display text-[clamp(3.5rem,5vw,5rem)] font-bold leading-[0.88] tracking-[-0.04em] text-heading uppercase">
              Selected case studies.
            </h2>
          </div>

          <div className="grid gap-4 border-2 border-stroke bg-surface p-6">
            <p className={monoLabelClass}>What's inside</p>
            <p className="max-w-120 text-[1.05rem] leading-relaxed text-ink-soft">
              Each case study covers what shipped, how it was built, and the engineering trade-offs that drove the final architecture.
            </p>
            <Link className={textLinkClass} to="/projects">
              Browse All Projects ↗
            </Link>
          </div>
        </div>

        {status === 'loading' ? (
          <div className="grid gap-6">
            <RouteState
              ariaLive="polite"
              description="Loading featured projects."
              label="Loading"
              role="status"
              title="Featured projects incoming."
            />

            <div className="grid gap-6 md:grid-cols-2" aria-hidden="true">
              {[0, 1].map((index) => (
                <article key={index} className={`${surfaceCardClass} p-6`}>
                  <div className="grid gap-5 border-b-2 border-stroke pb-5">
                    <div className="h-7 w-24 border-2 border-stroke bg-panel" />
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

        {status === 'error' ? (
          <RouteState
            actions={(
              <>
                <button className={secondaryButtonClass} onClick={retry} type="button">
                  Try Again
                </button>
                <Link className={textLinkClass} to="/projects">
                  Browse All Projects ↗
                </Link>
              </>
            )}
            description={featuredMessage}
            label="Unavailable"
            role="alert"
            title="Featured projects are temporarily unavailable."
          />
        ) : null}

        {status === 'success' && featuredProjects.length === 0 ? (
          <RouteState
            actions={<Link className={textLinkClass} to="/projects">Browse All Projects ↗</Link>}
            description="Featured case studies haven't been published yet. Browse the full archive to explore the portfolio."
            label="No featured projects yet"
            title="No featured projects yet."
          />
        ) : null}

        {status === 'success' && featuredProjects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.slug} order={index + 1} project={project} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-12 pb-8 pt-16 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.4fr)] xl:items-start">
        <div>
          <SectionLabel>How I Work</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(3.5rem,5vw,5rem)] font-bold leading-[0.88] tracking-[-0.04em] text-heading uppercase">
            How I like to work.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1.1rem] leading-relaxed text-ink-soft">
            I start by understanding what the system needs to do under real conditions: actual load, real users, genuine failure modes. The methodology below reflects how that thinking shapes every build, from the first architecture sketch to the monitoring dashboard.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {workingPrinciples.map((principle, index) => (
            <article
              key={principle.title}
              className={`${surfaceCardClass} p-8 ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <p className={monoLabelClass}>Principle {index + 1}</p>
              <h3 className="mt-6 font-display text-[1.8rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
                {principle.title}
              </h3>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">{principle.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

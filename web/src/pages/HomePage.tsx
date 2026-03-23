import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { CarouselNav } from '../components/CarouselNav'
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

const engineeringDepthItems = [
  {
    src: '/assets/projects/diagrams/v10-by-the-numbers.webp',
    alt: 'Aggregate portfolio metrics: 886k+ lines of code, 3,669 source files, 1,110 test files, 200+ DB migrations across 13 repositories.',
    caption: 'By the numbers',
    label: 'Aggregate metrics',
  },
  {
    src: '/assets/projects/diagrams/v04-agent-systems.webp',
    alt: 'Three agent architectures compared: SubCorp autonomous collective, JuryRigged deterministic courtroom, and Cutroom production pipeline.',
    caption: 'Agent architectures',
    label: 'Three patterns',
  },
  {
    src: '/assets/projects/diagrams/v05-postgres-depth.webp',
    alt: 'PostgreSQL feature matrix across 10 projects showing usage of FTS, pgvector, PostGIS, SKIP LOCKED, sqlc, Alembic, Prisma, and materialized views.',
    caption: 'PostgreSQL depth',
    label: 'Feature matrix',
  },
]

const ROTATE_INTERVAL_MS = 6000

function EngineeringDepthCarousel() {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const item = engineeringDepthItems[index]

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1) % engineeringDepthItems.length)
  }, [])

  const goTo = useCallback((next: number) => {
    setIndex(next)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, ROTATE_INTERVAL_MS)
  }, [advance])

  useEffect(() => {
    timerRef.current = setInterval(advance, ROTATE_INTERVAL_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [advance])

  return (
    <>
      <figure className={`${surfaceCardClass} mx-auto max-w-4xl overflow-hidden bg-panel`}>
        <div className="flex items-center justify-between border-b-2 border-stroke bg-surface px-5 py-4">
          <p className={monoLabelClass}>{`${String(index + 1).padStart(2, '0')} / ${String(engineeringDepthItems.length).padStart(2, '0')}`}</p>
          <button
            className="inline-flex cursor-pointer items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.15em] text-ink-soft transition-colors duration-150 hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
            onClick={() => setLightboxOpen(true)}
            type="button"
            aria-label={`View ${item.caption} fullscreen`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
            Expand
          </button>
        </div>

        <div className="border-b-2 border-stroke bg-surface" style={{ aspectRatio: '16 / 10' }}>
          <img
            className="h-full w-full object-contain"
            src={item.src}
            alt={item.alt}
            decoding="async"
            key={item.src}
            width={1600}
            height={1000}
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <figcaption className="text-[0.98rem] leading-relaxed text-ink-soft">
            {item.caption}
          </figcaption>

          <CarouselNav
            onPrev={() => goTo((index - 1 + engineeringDepthItems.length) % engineeringDepthItems.length)}
            onNext={() => goTo((index + 1) % engineeringDepthItems.length)}
            prevLabel="Previous diagram"
            nextLabel="Next diagram"
          />
        </div>
      </figure>

      {lightboxOpen ? (
        <DiagramLightbox
          initialIndex={index}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  )
}

function DiagramLightbox({ initialIndex, onClose }: { initialIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(initialIndex)
  const item = engineeringDepthItems[index]

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + engineeringDepthItems.length) % engineeringDepthItems.length)
  }, [])

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % engineeringDepthItems.length)
  }, [])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, goPrev, goNext])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-paper/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Engineering depth diagram viewer"
    >
      <div className="flex shrink-0 items-center justify-between border-b-2 border-stroke bg-surface px-5 py-4">
        <div className="flex items-center gap-4">
          <p className={monoLabelClass}>{item.caption}</p>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.15em] text-ink-soft">
            {index + 1} / {engineeringDepthItems.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CarouselNav onPrev={goPrev} onNext={goNext} />
          <button
            aria-label="Close viewer"
            className="inline-flex cursor-pointer items-center justify-center border-2 border-stroke bg-surface px-4 py-3 text-heading transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-accent-green hover:text-accent-green hover:shadow-brutal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-x-0 active:translate-y-0 active:shadow-none"
            onClick={onClose}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <img
          className="max-h-full max-w-full object-contain"
          src={item.src}
          alt={item.alt}
          key={item.src}
        />
      </div>

      {item.alt ? (
        <div className="shrink-0 border-t-2 border-stroke bg-surface px-5 py-3">
          <p className="text-[0.85rem] leading-relaxed text-ink-soft">{item.alt}</p>
        </div>
      ) : null}
    </div>
  )
}

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
      transition: { duration: 0.3, ease: 'easeOut' as const },
    }
  const fadeInProps = prefersReducedMotion
    ? {}
    : {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, delay: 0.1, ease: 'easeOut' as const },
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
              <p className="mt-5 font-display text-[2.2rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
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
                    className="border-2 border-stroke bg-surface px-4 py-3 font-mono text-[0.8rem] uppercase tracking-[0.15em] text-heading transition-colors duration-150 ease-out hover:border-accent-pink hover:bg-accent-pink hover:text-paper"
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

      <section className="border-b-2 border-stroke pb-16 pt-16">
        <div className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,auto)] lg:items-end">
          <div>
            <SectionLabel>Engineering Depth</SectionLabel>
            <h2 className="mt-6 max-w-[15ch] font-display text-[clamp(3.5rem,5vw,5rem)] font-bold leading-[0.88] tracking-[-0.04em] text-heading uppercase">
              Portfolio at scale.
            </h2>
          </div>
          <p className="max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft">
            Cross-cutting views across thirteen repositories: aggregate metrics, architecture patterns, and the PostgreSQL backbone that ties it all together.
          </p>
        </div>

        <EngineeringDepthCarousel />
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

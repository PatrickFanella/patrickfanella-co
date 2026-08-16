import { useCallback, useEffect, useRef, useState } from 'react'
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

export function HomePage() {
  const { projects, status, error, retry } = useProjects()
  const flagships = projects.filter((project) => project.classification === 'flagship')

  return (
    <>
      <Seo
        description="Patrick Fanella is a senior full-stack and backend engineer who builds operational products from data modeling and API design through React interfaces and production delivery."
        image="/assets/social/patrick-fanella-portfolio-1200x630.png"
        imageAlt="Patrick Fanella, Senior Full-Stack and Backend Engineer"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          jobTitle: 'Senior Full-Stack and Backend Engineer',
          knowsAbout: focusAreas,
          name: 'Patrick Fanella',
          sameAs: ['https://github.com/PatrickFanella', 'https://git.subcult.tv/PatrickFanella', 'https://linkedin.com/in/patrick-fanella'],
          url: getSiteUrl(),
        }}
      />

      <section className="grid gap-8 border-b-2 border-stroke pb-12 pt-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.65fr)] lg:items-end">
        <div>
          <SectionLabel>Senior Full-Stack / Backend</SectionLabel>
          <h1 className="mt-5 max-w-[13ch] font-display text-[clamp(3.2rem,8vw,7.6rem)] font-bold uppercase leading-[0.84] tracking-[-0.055em] text-heading">
            <span className="block">Backend depth.</span>{' '}
            <span className="block text-accent-pink">User minded.</span>{' '}
            <span className="block text-accent-green">Product ownership.</span>
          </h1>
          <p className="mt-6 max-w-[48ch] text-[1.08rem] leading-relaxed text-ink-soft sm:text-[1.2rem]">
            I build operational products from data model and API design through accessible React interfaces and production delivery—using Go, Python, TypeScript, PostgreSQL, search, and asynchronous workflows.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={primaryButtonClass} to="/projects">Review the case studies</Link>
            <Link className={secondaryButtonClass} to="/resume">Download my résumé</Link>
            <Link className={textLinkClass} to="/contact">Discuss a role →</Link>
          </div>
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
  const { projects, status, error, retry } = useProjects()
  const caseStudies = projects.filter((project) => project.kind === 'case-study')
  const highlights = projects.filter((project) => project.kind === 'highlight')
  const tools = projects.filter((project) => project.kind === 'tool')
  const featuredProjects = caseStudies.filter((project) => project.featured)

  const featuredMessage = getErrorMessage(
    error,
    'Featured case studies are temporarily unavailable.',
  )
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    jobTitle: 'Full Stack Developer',
    knowsAbout: focusAreas,
    name: 'Patrick Fanella',
    sameAs: ['https://github.com/PatrickFanella', 'https://git.subcult.tv/PatrickFanella'],
    url: getSiteUrl(),
  }

  return (
    <>
      <Seo structuredData={structuredData} />
      <section className="border-b-2 border-stroke pb-16 pt-8">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <div className="flex flex-col justify-center">
            <SectionLabel>Index / 2026</SectionLabel>

            <h1
              className="mt-8 font-display text-[clamp(4rem,8vw,8rem)] font-bold leading-[0.85] tracking-[-0.05em] text-heading uppercase"
            >
              Backend<span className="text-accent-green"> depth.</span> Frontend<span className="text-accent-teal"> clarity.</span> Production<span className="text-accent-pink"> discipline.</span>
            </h1>

            <p
              className={`${pageIntroClass} max-w-[46ch] mt-8 text-[1.2rem]`}
            >
              I'm <span className="text-accent-pink">Patrick Fanella</span>. I build production software across Go, React, Python, and TypeScript — AI agent platforms, GPU transcription pipelines, 3D graph tools, and on-chain provenance systems. From first commit to monitored deployment.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link className={primaryButtonClass} to="/projects">
                View Case Studies
              </Link>
              <Link className={secondaryButtonClass} to="/contact">
                Get in Touch
              </Link>
            </div>
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
            <SectionLabel>Selected evidence</SectionLabel>
            <h2 className="mt-5 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-heading" id="featured-heading">
              Selected work.
            </h2>
          </div>
          <p className="max-w-[38ch] text-ink-soft">Projects showing production delivery, user-minded design, and systems under active development.</p>
        </div>

        {status === 'loading' ? <RouteState ariaLive="polite" description="Loading the selected case studies." label="Loading" role="status" title="Loading featured work." /> : null}
        {status === 'error' ? (
          <RouteState
            actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try again</button>}
            description={getErrorMessage(error, 'Featured case studies are temporarily unavailable.')}
            label="Unavailable"
            role="alert"
            title="Featured work could not be loaded."
          />
        ) : null}
        {status === 'success' ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {flagships.map((project, index) => <ProjectCard key={project.slug} order={index + 1} project={project} />)}
            </div>
            <div className="mt-8">
              <Link className={secondaryButtonClass} to="/archive">View all projects</Link>
            </div>
          </>
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
            Cross-cutting views across the portfolio: aggregate metrics, architecture patterns, and the PostgreSQL backbone that ties it all together.
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

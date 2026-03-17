import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { ProjectCard } from '../components/ProjectCard'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage } from '../lib/errors'
import {
  monoLabelClass,
  pageIntroClass,
  primaryButtonClass,
  secondaryButtonClass,
  surfaceCardClass,
  textLinkClass,
} from '../lib/styles'
import { useProjects } from '../lib/useProjects'

const focusAreas = ['React Ecosystem', 'TypeScript', 'Go', 'PostgreSQL / SQL']

const workingPrinciples = [
  {
    title: 'Functional > decorative',
    description:
      'We do not build interfaces to look pretty on Dribbble. We build them to surface information quickly and safely without taxing the user.',
  },
  {
    title: 'Strict mechanical sympathy',
    description:
      'Understanding how the data actually moves and persists makes the frontend significantly faster and less prone to edge-case errors.',
  },
  {
    title: 'High signal documentation',
    description:
      'Writing things down forces clarity. A codebase with a dense, unambiguous trail of decisions is much easier to inherit.',
  },
]

export function HomePage() {
  const { projects, status, error, retry } = useProjects()
  const featuredProjects = projects.filter((project) => project.featured)

  const featuredMessage = getErrorMessage(
    error,
    'Featured case studies are temporarily unavailable.',
  )

  return (
    <>
      <section className="border-b-2 border-stroke pb-16 pt-8">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
          <div className="flex flex-col justify-center">
            <SectionLabel>Index / 2026</SectionLabel>

            <motion.h1
              className="mt-8 font-display text-[clamp(4rem,8vw,8rem)] font-bold leading-[0.85] tracking-[-0.05em] text-heading uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: 'linear' }}
            >
              Uncompromising UI. <br/><span className="text-accent-purple">Solid State Data.</span>
            </motion.h1>

            <motion.p
              className={`${pageIntroClass} max-w-[46ch] mt-8 text-[1.2rem]`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1, ease: 'linear' }}
            >
              I build web interfaces that don't shift, glitch, or hesitate.
              Backed by strict Go APIs and predictable data shapes.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15, ease: 'linear' }}
            >
              <Link className={primaryButtonClass} to="/projects">
                Read the Case Studies
              </Link>
              <Link className={secondaryButtonClass} to="/contact">
                Initialize Contact
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-6 content-start">
            <aside className={`${surfaceCardClass} bg-panel p-8`} aria-label="Operating philosophy">
              <p className={monoLabelClass}>Philosophy</p>
              <p className="mt-6 font-display text-[2.2rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
                A good tool feels like an extension of intent.
              </p>
              <p className="mt-4 text-ink-soft leading-relaxed">
                If the interface is drawing attention to itself, it is usually getting in the way of the task. Keep it fast, keep it high contrast, keep it out of the way.
              </p>
            </aside>

            <aside className={`${surfaceCardClass} p-8`} aria-label="Core competences">
              <p className={monoLabelClass}>Competences</p>
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
            <SectionLabel>Verified builds</SectionLabel>
            <h2 className="mt-6 max-w-[15ch] font-display text-[clamp(3.5rem,5vw,5rem)] font-bold leading-[0.88] tracking-[-0.04em] text-heading uppercase">
              Production case logic.
            </h2>
          </div>

          <div className="grid gap-4 border-2 border-stroke bg-surface p-6">
            <p className={monoLabelClass}>Access</p>
            <p className="max-w-120 text-[1.05rem] leading-relaxed text-ink-soft">
              Every log is treated like internal documentation rather than marketing collateral.
            </p>
            <Link className={textLinkClass} to="/projects">
              Open master archive ↗
            </Link>
          </div>
        </div>

        {status === 'loading' ? (
          <div className="grid gap-6">
            <article
              className={`${surfaceCardClass} bg-panel p-6`}
              aria-live="polite"
              role="status"
            >
              <p className={monoLabelClass}>Loading</p>
              <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                Pulling the featured case-study set from the API.
              </p>
            </article>

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
          <article className={`${surfaceCardClass} grid gap-6 bg-panel p-8`} role="alert">
            <div>
              <p className={monoLabelClass}>Fetch fault</p>
              <h3 className="mt-5 font-display text-[2rem] font-bold uppercase tracking-[-0.04em] text-heading">
                Featured work is offline.
              </h3>
              <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                {featuredMessage}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className={secondaryButtonClass} onClick={retry} type="button">
                Retry request
              </button>
              <Link className={textLinkClass} to="/projects">
                Open master archive ↗
              </Link>
            </div>
          </article>
        ) : null}

        {status === 'success' && featuredProjects.length === 0 ? (
          <article className={`${surfaceCardClass} bg-panel p-8`}>
            <p className={monoLabelClass}>Empty set</p>
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
              Featured case studies have not been published yet. Use the master archive to browse the full portfolio once entries are seeded.
            </p>
          </article>
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
          <SectionLabel>Methodology</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(3.5rem,5vw,5rem)] font-bold leading-[0.88] tracking-[-0.04em] text-heading uppercase">
            No invisible magic.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1.1rem] leading-relaxed text-ink-soft">
            I don't trust systems that hide too much from the developer. Expose the seams, log the traffic, and enforce rigorous bounds on states.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {workingPrinciples.map((principle, index) => (
            <article
              key={principle.title}
              className={`${surfaceCardClass} p-8 ${index === 0 ? 'sm:col-span-2' : ''}`}
            >
              <p className={monoLabelClass}>Axiom {index + 1}</p>
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

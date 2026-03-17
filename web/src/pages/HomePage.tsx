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
    title: 'Project stories over résumé filler',
    description:
      'The clearest proof of judgment is shipped work, so the portfolio leads with case studies, trade-offs, and implementation detail.',
  },
  {
    title: 'Frontend and backend should agree',
    description:
      'Typed contracts, explicit data states, and predictable persistence make the interface calmer and easier to trust.',
  },
  {
    title: 'Documentation is part of the product',
    description:
      'Clear notes, seed content, and route-level intent keep a codebase easier to evolve than clever implementation alone.',
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
        Project-first builds. <br/><span className="text-accent-purple">Full stack clarity.</span>
            </motion.h1>

            <motion.p
              className={`${pageIntroClass} max-w-[46ch] mt-8 text-[1.2rem]`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1, ease: 'linear' }}
            >
        I'm Patrick Fanella, a full stack developer focused on React interfaces, Go APIs, and the connective tissue that makes shipped products feel considered.
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
                Good software should explain itself under pressure.
              </p>
              <p className="mt-4 text-ink-soft leading-relaxed">
                The best builds balance editorial clarity on the surface with calm, predictable systems underneath. That is the through-line across the work collected here.
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
              Selected case studies.
            </h2>
          </div>

          <div className="grid gap-4 border-2 border-stroke bg-surface p-6">
            <p className={monoLabelClass}>Access</p>
            <p className="max-w-120 text-[1.05rem] leading-relaxed text-ink-soft">
              Each project includes the outcome, the structure behind it, and the constraints that shaped the final implementation.
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
            How I like to work.
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1.1rem] leading-relaxed text-ink-soft">
            The work tends to sit at the seam between interface craft and implementation discipline: build the right surface, then make the underlying system easy to reason about.
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

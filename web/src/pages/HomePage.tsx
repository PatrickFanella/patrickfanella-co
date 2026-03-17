import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { ProjectCard } from '../components/ProjectCard'
import { SectionLabel } from '../components/SectionLabel'
import { projects } from '../data/projects'
import {
  pageIntroClass,
  primaryButtonClass,
  secondaryButtonClass,
  surfaceCardClass,
  textLinkClass,
} from '../lib/styles'

const featuredProjects = projects.filter((project) => project.featured)

export function HomePage() {
  return (
    <>
      <section className="px-1 pb-4 pt-7">
        <SectionLabel>Project-led portfolio</SectionLabel>

        <div className="grid gap-6 md:grid-cols-[1.7fr_1fr]">
          <div className={`${surfaceCardClass} p-7 md:p-8.5`}>
            <motion.h1
              className="max-w-[11ch] font-display text-[clamp(3rem,5vw,5.6rem)] leading-[0.98] text-heading"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              Building calm, capable web products with a tactile point of view.
            </motion.h1>
            <p className={pageIntroClass}>
              I&apos;m Patrick Fanella, a full stack developer focused on well-made
              interfaces, pragmatic backend systems, and project stories that show
              how things were actually built.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link className={primaryButtonClass} to="/projects">
                View selected projects
              </Link>
              <Link className={secondaryButtonClass} to="/contact">
                Get in touch
              </Link>
            </div>
          </div>

          <aside className={`${surfaceCardClass} self-stretch p-7`} aria-label="Developer profile summary">
            <p className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-ink-soft">
              Filed under
            </p>
            <dl className="mt-4.5 grid gap-4.5">
              <div>
                <dt className="font-semibold text-heading">Focus</dt>
                <dd className="mt-1.5 text-ink-soft">React, TypeScript, Go, PostgreSQL</dd>
              </div>
              <div>
                <dt className="font-semibold text-heading">Strength</dt>
                <dd className="mt-1.5 text-ink-soft">
                  Projects with clear product and engineering rationale
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-heading">Approach</dt>
                <dd className="mt-1.5 text-ink-soft">
                  Professional polish without template energy
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="px-1 pb-4 pt-7">
        <div className="mb-4.5 grid gap-6 md:grid-cols-2 md:items-start">
          <SectionLabel>Selected work</SectionLabel>
          <Link className={`${textLinkClass} md:justify-self-start`} to="/projects">
            See all projects
          </Link>
        </div>

        <div className="grid gap-4.5 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 px-1 pb-4 pt-7 md:grid-cols-[1.7fr_1fr] md:items-start">
        <div>
          <SectionLabel>What this site is built to do</SectionLabel>
          <h2 className="mt-3 max-w-[18ch] font-display text-[2.4rem] leading-[1.02] text-heading md:text-[2.8rem]">
            Lead with projects, not résumé padding.
          </h2>
          <p className="mt-4 max-w-[62ch] text-ink-soft">
            This portfolio is scaffolded to present case studies first, explain the
            technical choices behind them, and keep the story centered on the work.
          </p>
        </div>

        <div className="grid gap-4">
          <article className={`${surfaceCardClass} p-6`}>
            <h3 className="mb-2 text-2xl leading-tight text-heading">Frontend craft</h3>
            <p className="text-ink-soft">
              Interfaces that feel deliberate, responsive, and easy to trust.
            </p>
          </article>
          <article className={`${surfaceCardClass} p-6`}>
            <h3 className="mb-2 text-2xl leading-tight text-heading">Backend thinking</h3>
            <p className="text-ink-soft">
              Lean APIs, structured data, and clean foundations for iteration.
            </p>
          </article>
          <article className={`${surfaceCardClass} p-6`}>
            <h3 className="mb-2 text-2xl leading-tight text-heading">Case study clarity</h3>
            <p className="text-ink-soft">
              Projects framed around goals, trade-offs, and what actually mattered.
            </p>
          </article>
        </div>
      </section>
    </>
  )
}

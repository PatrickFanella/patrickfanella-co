import { Link, useParams } from 'react-router-dom'

import { SectionLabel } from '../components/SectionLabel'
import { projects } from '../data/projects'
import {
  monoLabelClass,
  pageIntroClass,
  pageSectionClass,
  pageTitleClass,
  primaryButtonClass,
  surfaceCardClass,
  tagClass,
  tagListClass,
  textLinkClass,
} from '../lib/styles'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const project = projects.find((item) => item.slug === slug)
  const metaCardClass =
    'grid gap-2 border-2 border-stroke bg-surface px-5 py-4 text-ink-soft'

  if (!project) {
    return (
      <section className={pageSectionClass}>
        <SectionLabel>Status 404</SectionLabel>
        <h1 className={`${pageTitleClass} mt-6 uppercase`}>
          Record not found.
        </h1>
        <p className={pageIntroClass}>
          The directory path is valid, but the target record is unassigned or deleted.
        </p>
        <Link className={`${primaryButtonClass} mt-8`} to="/projects">
          Return to index
        </Link>
      </section>
    )
  }

  return (
    <section className={pageSectionClass}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] lg:items-start border-b-2 border-stroke pb-16 mb-8">
        <div>
          <SectionLabel>{`Study / ${project.year}`}</SectionLabel>
          <h1 className={`${pageTitleClass} mt-6 uppercase max-w-[14ch]`}>{project.title}</h1>
          <p className={`${pageIntroClass} text-[1.2rem] text-ink`}>{project.summary}</p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Project meta information">
          <p className={monoLabelClass}>Parameters</p>
          <div className="mt-6 grid gap-4">
            <p className={metaCardClass}>
              <span className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-green font-bold">
                Assignment
              </span>
              <span className="text-[1.05rem] text-heading">{project.role}</span>
            </p>
            <p className={metaCardClass}>
              <span className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-green font-bold">
                Timestamp
              </span>
              <span className="text-[1.05rem] text-heading">{project.year}</span>
            </p>
          </div>

          <div className="mt-8">
            <h2 className="font-mono text-[0.8rem] font-bold uppercase tracking-[0.18em] text-accent-green mb-4">Infrastructure</h2>
            <ul className={tagListClass}>
              {project.stack.map((item) => (
                <li key={item} className={tagClass}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.8fr)] lg:items-start">
        <article className="pr-4 lg:pr-8">
          <SectionLabel>Post-mortem</SectionLabel>
          <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
            Execution logic
          </h2>
          <p className="mt-6 text-[1.1rem] leading-relaxed text-ink-soft max-w-[55ch]">
            {project.description}
          </p>
        </article>

        <article className={`${surfaceCardClass} bg-surface p-8`}>
          <p className={monoLabelClass}>Critical Path</p>
          <ul className="mt-6 grid list-none gap-4 p-0 text-ink-soft">
            {project.highlights.map((highlight, index) => (
              <li
                key={highlight}
                className="border-2 border-stroke bg-panel p-5 grid gap-3"
              >
                <p className="font-mono text-[0.85rem] font-bold text-accent-purple">0{index + 1}</p>
                <p className="text-[1.05rem] leading-relaxed">{highlight}</p>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="mt-16 border-t-2 border-stroke pt-8">
        <Link className={textLinkClass} to="/projects">
          ← Terminate view
        </Link>
      </div>
    </section>
  )
}

import { Link, useParams } from 'react-router-dom'

import { SectionLabel } from '../components/SectionLabel'
import { projects } from '../data/projects'
import {
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

  if (!project) {
    return (
      <section className={pageSectionClass}>
        <SectionLabel>Project not found</SectionLabel>
        <h1 className={`${pageTitleClass} mt-3`}>
          This case study hasn&apos;t been filed yet.
        </h1>
        <p className={pageIntroClass}>
          The route is working — it just needs a real project entry.
        </p>
        <Link className={`${primaryButtonClass} mt-6`} to="/projects">
          Back to projects
        </Link>
      </section>
    )
  }

  return (
    <section className={pageSectionClass}>
      <SectionLabel>Case study</SectionLabel>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div>
          <h1 className={`${pageTitleClass} mt-3`}>{project.title}</h1>
          <p className={pageIntroClass}>{project.summary}</p>
        </div>
        <div className="grid justify-items-start gap-3">
          <p className="grid min-w-40 gap-1.5 rounded-[18px] bg-[rgba(91,68,49,0.08)] px-4.5 py-4 text-ink-soft">
            <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-ink-soft">
              Role
            </span>
            {project.role}
          </p>
          <p className="grid min-w-40 gap-1.5 rounded-[18px] bg-[rgba(91,68,49,0.08)] px-4.5 py-4 text-ink-soft">
            <span className="font-mono text-[0.78rem] uppercase tracking-[0.18em] text-ink-soft">
              Year
            </span>
            {project.year}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1.7fr_1fr]">
        <article className={`${surfaceCardClass} p-6`}>
          <h2 className="mb-2 text-2xl leading-tight text-heading">Overview</h2>
          <p className="text-ink-soft">{project.description}</p>
        </article>

        <article className={`${surfaceCardClass} p-6`}>
          <h2 className="mb-2 text-2xl leading-tight text-heading">Highlights</h2>
          <ul className="grid gap-2.5 pl-5 text-ink-soft">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      </div>

      <article className={`${surfaceCardClass} my-4.5 p-6`}>
        <h2 className="mb-2 text-2xl leading-tight text-heading">Stack</h2>
        <ul className={tagListClass}>
          {project.stack.map((item) => (
            <li key={item} className={tagClass}>
              {item}
            </li>
          ))}
        </ul>
      </article>

      <Link className={textLinkClass} to="/projects">
        ← Back to all projects
      </Link>
    </section>
  )
}

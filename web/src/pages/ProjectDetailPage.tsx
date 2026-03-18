import { Link, useParams } from 'react-router-dom'

import { ProjectMediaGallery } from '../components/ProjectMediaGallery'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage, isNotFoundError } from '../lib/errors'
import { getSiteUrl } from '../lib/site'
import {
  monoLabelClass,
  pageIntroClass,
  pageSectionClass,
  pageTitleClass,
  primaryButtonClass,
  secondaryButtonClass,
  surfaceCardClass,
  tagClass,
  tagListClass,
  textLinkClass,
} from '../lib/styles'
import { useProject } from '../lib/useProjects'

export function ProjectDetailPage() {
  const { slug } = useParams()
  const { project, status, error, retry } = useProject(slug)
  const siteUrl = getSiteUrl()
  const metaCardClass =
    'grid gap-2 border-2 border-stroke bg-surface px-5 py-4 text-ink-soft'

  if (status === 'loading') {
    return (
      <section className={pageSectionClass}>
        <Seo
          description="Fetching project details, supporting media, and architecture notes."
          path={slug ? `/projects/${slug}` : '/projects'}
          title="Loading project"
        />
        <RouteState
          ariaLive="polite"
          description="Fetching the case study, supporting media, and architecture notes from the API."
          headingLevel="h1"
          label="Lookup pending"
          role="status"
          title="Loading record."
        />
      </section>
    )
  }

  if (status === 'error' && isNotFoundError(error)) {
    return (
      <section className={pageSectionClass}>
        <Seo
          description="The requested case study has not been published yet."
          path={slug ? `/projects/${slug}` : '/projects'}
          robots="noindex,follow"
          title="Project not found"
        />
        <RouteState
          actions={
            <Link className={primaryButtonClass} to="/projects">
              Return to index
            </Link>
          }
          description="The route exists, but this case study has not been published yet."
          headingLevel="h1"
          label="Status 404"
          title="Record not found."
        />
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className={pageSectionClass}>
        <Seo
          description="The requested case study could not be loaded."
          path={slug ? `/projects/${slug}` : '/projects'}
          robots="noindex,follow"
          title="Project unavailable"
        />
        <RouteState
          actions={(
            <>
              <button className={secondaryButtonClass} onClick={retry} type="button">
                Retry lookup
              </button>
              <Link className={textLinkClass} to="/projects">
                Return to index
              </Link>
            </>
          )}
          description={getErrorMessage(error, 'The requested case study could not be loaded.')}
          headingLevel="h1"
          label="Route fault"
          role="alert"
          title="Unable to load record."
        />
      </section>
    )
  }

  if (!project) {
    return null
  }

  return (
    <section className={pageSectionClass}>
      <Seo
        description={project.summary}
        image={project.media[0]?.src}
        path={`/projects/${project.slug}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          author: {
            '@type': 'Person',
            name: 'Patrick Fanella',
          },
          description: project.summary,
          headline: project.title,
            image: project.media[0]?.src ? [`${siteUrl}${project.media[0].src}`] : undefined,
          keywords: project.stack.join(', '),
          name: project.title,
            url: `${siteUrl}/projects/${project.slug}`,
        }}
        title={project.title}
        type="article"
      />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] lg:items-start border-b-2 border-stroke pb-16 mb-8">
        <div>
          <SectionLabel>{`Case study / ${project.year}`}</SectionLabel>
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

          {project.repoUrl || project.liveUrl ? (
            <div className="mt-8 grid gap-3 border-t-2 border-stroke pt-6">
              {project.repoUrl ? (
                <a className={textLinkClass} href={project.repoUrl} rel="noreferrer" target="_blank">
                  Open repository ↗
                </a>
              ) : null}
              {project.liveUrl ? (
                <a className={textLinkClass} href={project.liveUrl} rel="noreferrer" target="_blank">
                  Launch project ↗
                </a>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.8fr)] lg:items-start">
        <article className="pr-4 lg:pr-8">
          <SectionLabel>Overview</SectionLabel>
          <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
            What shipped and why.
          </h2>
          <p className="mt-6 text-[1.1rem] leading-relaxed text-ink-soft max-w-[55ch]">
            {project.description}
          </p>
        </article>

        <article className={`${surfaceCardClass} bg-surface p-8`}>
          <p className={monoLabelClass}>Key outcomes</p>
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

      {project.architecture.length > 0 ? (
        <section className="mt-16 grid gap-8 border-t-2 border-stroke pt-10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:items-end">
            <div>
              <SectionLabel>Architecture</SectionLabel>
              <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
                System choices that mattered.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft">
              A concise breakdown of the technical structure behind the shipped result.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {project.architecture.map((item, index) => (
              <article key={item} className={`${surfaceCardClass} bg-panel p-6`}>
                <p className={monoLabelClass}>{`Choice ${index + 1}`}</p>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">{item}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {project.media.length > 0 ? (
        <section className="mt-16 grid gap-8 border-t-2 border-stroke pt-10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:items-end">
            <div>
              <SectionLabel>Supporting media</SectionLabel>
              <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
                Visual references for the build.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft">
              Architecture diagrams, interface captures, and supporting visuals for the build.
            </p>
          </div>

          <ProjectMediaGallery items={project.media} projectTitle={project.title} />
        </section>
      ) : null}

      {project.lessons.length > 0 ? (
        <section className="mt-16 grid gap-8 border-t-2 border-stroke pt-10">
          <div>
            <SectionLabel>Lessons learned</SectionLabel>
            <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
              What the next version would keep.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {project.lessons.map((lesson, index) => (
              <article key={lesson} className={`${surfaceCardClass} bg-panel p-6`}>
                <p className={monoLabelClass}>{`Lesson ${index + 1}`}</p>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">{lesson}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-16 border-t-2 border-stroke pt-8">
        <Link className={textLinkClass} to="/projects">
          ← Terminate view
        </Link>
      </div>
    </section>
  )
}

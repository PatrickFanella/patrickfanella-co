import { Link, Navigate, useParams } from 'react-router-dom'

import { ProjectMediaGallery } from '../components/ProjectMediaGallery'
import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import { getErrorMessage, isNotFoundError } from '../lib/errors'
import { getSiteUrl } from '../lib/site'
import {
  monoLabelClass,
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

const flagshipProblemHeadings: Record<string, string> = {
  clpr: 'Twitch clips disappear after the stream.',
  patchwork: 'Discovery without exposing precise locations.',
  hasanara: 'Finding one moment across hundreds of hours.',
  clustr: 'Community relationships are invisible.',
  subcults: 'Discovery without feeding an algorithm.',
  switchyard: 'Automation you can actually watch.',
  'subcult-os': 'Live event operations are fragmented.',
}

const flagshipSeoTitles: Record<string, string> = {
  clpr: 'Clpr Case Study — Go, React & Hybrid Search',
  patchwork: 'Patchwork Case Study — AT Protocol & Location Privacy',
  hasanara: 'HasanAra Case Study — GPU Transcription & Search',
  clustr: 'Clustr Case Study — Graph Analysis & Unity Client',
  subcults: 'Subcults Case Study — Go, Maps & Community Infrastructure',
  switchyard: 'SwitchYard Case Study — Go, React & Workflow Routing',
  'subcult-os': 'Subcult-OS Case Study — Go, React & Event Operations',
}

const bespokeSocialImageSlugs = new Set(['clpr', 'patchwork', 'hasanara'])

export function ProjectDetailPage() {
  const { slug } = useParams()
  const { project, status, error, retry } = useProject(slug)
  const siteUrl = getSiteUrl()
  const metaCardClass =
    'flex items-baseline gap-3 border-2 border-stroke bg-surface px-5 pt-[calc(0.75rem+0.5px)] pb-[calc(0.75rem-0.5px)] text-ink-soft'

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
          description="Fetching the project details, media, and architecture notes."
          headingLevel="h1"
          label="Loading"
          role="status"
          title="Loading case study."
        />
      </section>
    )
  }

  if (status === 'error' && isNotFoundError(error)) {
    return (
      <section className={pageSectionClass}>
        <Seo
          description="The requested case study has not been published yet."
          includeCanonical={false}
          includeSocialUrl={false}
          path={slug ? `/projects/${slug}` : '/projects'}
          robots="noindex,follow"
          title="Project not found"
        />
        <RouteState
          actions={
            <Link className={primaryButtonClass} to="/projects">
              Back to Projects
            </Link>
          }
          description="The route exists, but this case study has not been published yet."
          headingLevel="h1"
          label="Not found"
          title="This case study isn't available."
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
                Try Again
              </button>
              <Link className={textLinkClass} to="/projects">
                Back to Projects
              </Link>
            </>
          )}
          description={getErrorMessage(error, 'The requested case study could not be loaded.')}
          headingLevel="h1"
          label="Unavailable"
          role="alert"
          title="Unable to load case study."
        />
      </section>
    )
  }

  if (!project) {
    return null
  }

  if (project.kind === 'tool') {
    return <Navigate replace to="/archive#tools" />
  }

  return (
    <section className={pageSectionClass}>
      <Seo
        description={project.summary}
        image={bespokeSocialImageSlugs.has(project.slug)
          ? `/assets/social/${project.slug}-1200x630.png`
          : project.classification === 'flagship'
            ? '/assets/social/patrick-fanella-portfolio-1200x630.png'
            : project.media[0]?.src}
        imageAlt={`${project.title} case study by Patrick Fanella`}
        path={`/projects/${project.slug}`}
        robots={project.classification === 'flagship' ? 'index,follow' : 'noindex,follow'}
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
        title={flagshipSeoTitles[project.slug] || project.title}
        type="article"
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] lg:items-start border-b-2 border-stroke pb-10 mb-8">
        <div>
          <SectionLabel>{project.category}</SectionLabel>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>{project.title}</h1>
          <p className="mt-6 max-w-[55ch] text-[1.2rem] leading-relaxed text-ink">{project.summary}</p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-6`} aria-label="Project overview">
          <p className={monoLabelClass}>At a glance</p>
          <div className="mt-5 grid gap-3">
            <p className={metaCardClass}>
              <span className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-green font-bold">
                Domain
              </span>
              <span className="text-[1.05rem] text-heading">{project.category}</span>
            </p>
            {project.coreMechanism ? (
              <p className={metaCardClass}>
                <span className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-green font-bold">
                  Mechanism
                </span>
                <span className="text-[1.05rem] text-heading">{project.coreMechanism}</span>
              </p>
            ) : null}
            {project.shippedOutcome ? (
              <p className={metaCardClass}>
                <span className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-green font-bold">
                  Outcome
                </span>
                <span className="text-[1.05rem] text-heading">{project.shippedOutcome}</span>
              </p>
            ) : null}
          </div>

          {project.repoUrl || project.liveUrl ? (
            <div className="mt-5 flex flex-wrap gap-4 border-t-2 border-stroke pt-5">
              {project.repoUrl ? (
                <a className={textLinkClass} href={project.repoUrl} rel="noreferrer" target="_blank">
                  View source ↗
                </a>
              ) : null}
              {project.liveUrl ? (
                <a className={textLinkClass} href={project.liveUrl} rel="noreferrer" target="_blank">
                  Open {project.title} ↗
                </a>
              ) : null}
            </div>
          ) : null}
        </aside>

        <ul className={`${tagListClass} lg:col-span-2`}>
          {project.stack.map((item) => (
            <li key={item} className={tagClass}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-start">
        <article className="pr-4 lg:pr-8">
          <SectionLabel>Problem and ownership</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(2rem,3.4vw,2.9rem)] font-bold leading-[0.95] tracking-[-0.04em] text-heading uppercase">
            {flagshipProblemHeadings[project.slug] || 'The problem it solves.'}
          </h2>
          <p className="mt-6 text-[1.1rem] leading-relaxed text-ink-soft">
            {project.problem}
          </p>
          <p className="mt-4 text-[1.1rem] leading-relaxed text-ink-soft">
            {project.description}
          </p>
        </article>

        <article className={`${surfaceCardClass} bg-surface p-8`}>
          <h2 className="font-display text-[clamp(1.75rem,2.6vw,2.3rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-heading">
            What I shipped.
          </h2>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
            The concrete outcomes I delivered.
          </p>
          <ul className="mt-6 grid list-none gap-4 p-0 text-ink-soft">
            {project.highlights.map((highlight, index) => (
              <li
                key={highlight}
                className="border-2 border-stroke bg-panel p-5 grid gap-3"
              >
                <p className="font-mono text-[0.85rem] font-bold text-accent-purple">{String(index + 1).padStart(2, '0')}</p>
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
                Decisions and tradeoffs.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft lg:justify-self-end lg:text-right">
              Why the system is built this way, including the constraints each choice introduced.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {project.architecture.map((item, index) => (
              <article key={item} className={`${surfaceCardClass} bg-panel p-6`}>
                <p className={monoLabelClass}>{`Decision ${index + 1}`}</p>
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
                See it working.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft lg:justify-self-end lg:text-right">
              Product captures and architecture diagrams showing the implemented system.
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
              What I learned.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {project.lessons.map((lesson, index) => (
              <article key={lesson} className={`${surfaceCardClass} bg-panel p-6`}>
                <p className={monoLabelClass}>{`Lesson ${index + 1}`}</p>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft">{lesson}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {project.classification === 'flagship' ? (
        <section className={`${surfaceCardClass} mt-16 grid gap-6 bg-panel p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end`} aria-labelledby="case-study-contact-heading">
          <div>
            <SectionLabel>Work together</SectionLabel>
            <h2 className="mt-5 font-display text-[2.25rem] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-heading" id="case-study-contact-heading">Discuss this work.</h2>
            <p className="mt-4 max-w-[58ch] leading-relaxed text-ink-soft">Building a product with similar backend, search, data, or workflow challenges? I'd be glad to discuss the tradeoffs and hear about the role.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className={primaryButtonClass} to="/contact">Discuss a role</Link>
            <a className={secondaryButtonClass} download="Patrick_Fanella_Resume.pdf" href="/assets/patrick_fanella_resume.pdf">Download résumé</a>
          </div>
        </section>
      ) : null}

      <div className="mt-10 border-t-2 border-stroke pt-8">
        <Link className={textLinkClass} to="/projects">← Back to Projects</Link>
      </div>
    </section>
  )
}

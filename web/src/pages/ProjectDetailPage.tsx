import { Link, useParams } from 'react-router-dom'

import { Icon } from '../components/Icon'
import { ProjectBrand } from '../components/ProjectBrand'
import { ProjectRelations } from '../components/ProjectRelations'
import { ProjectMediaGallery } from '../components/ProjectMediaGallery'
import { LoadingState, RouteState } from '../components/RouteState'
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
  tadooer: 'One plan, even when clients disagree.',
  'super-productivity-mcp': 'A task manager needs more than a prompt.',
  clpr: 'A good clip is hard to find twice.',
  patchwork: 'A request needs an area, not an address.',
  hasanara: 'Finding one moment across hundreds of hours.',
  prichal: 'Your own server, without running it.',
  undertow: 'A track needs something to look at.',
  arkhiv: 'Keep the file, and say what you do not know.',
  backline: 'One server, the modules it needs.',
  kork: 'A link page that never touches the money.',
  switchyard: 'Automation you can watch.',
  'subcult-os': 'A show night runs on four different lists.',
}

const flagshipSeoTitles: Record<string, string> = {
  clpr: 'Clpr case study | Go, React and hybrid search',
  patchwork: 'Patchwork case study | AT Protocol and location privacy',
  hasanara: 'HasanAra case study | GPU transcription and search',
  prichal: 'Prichal case study | Go, mTLS and AT Protocol hosting',
  undertow: 'Undertow case study | WebCodecs video export in the browser',
  arkhiv: 'Arkhiv | Shared archive engine and collection frontends',
  backline: 'Backline case study | Discord bot, dashboard and PostgreSQL',
  kork: 'Kork case study | Go link pages without trackers',
  switchyard: 'Switchyard case study | Go, React and workflow routing',
  'subcult-os': 'Subcult OS case study | Go, React and event operations',
}

const bespokeSocialImageSlugs = new Set(['clpr', 'patchwork', 'hasanara'])

export function ProjectDetailPage() {
  const { slug } = useParams()
  const { project, status, error, retry } = useProject(slug)
  const siteUrl = getSiteUrl()

  if (status === 'loading') {
    return (
      <section className={pageSectionClass}>
        <Seo
          description="Loading project details."
          path={slug ? `/projects/${slug}` : '/projects'}
          title="Loading project"
        />
        <LoadingState description="Loading project details." headingLevel="h1" title="Loading case study." />
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
              Back to projects
            </Link>
          }
          description="This case study has not been published."
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
                Try again
              </button>
              <Link className={textLinkClass} to="/projects">
                Back to projects
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
          name: project.title,
          url: `${siteUrl}/projects/${project.slug}`,
        }}
        title={flagshipSeoTitles[project.slug] || project.title}
        type="article"
      />
      <header className="case-intro">
        <SectionLabel>{project.category}</SectionLabel>
        <div className="mt-6 flex items-center gap-5">
          <ProjectBrand className="case-brand" project={project} />
          <h1 className={`${pageTitleClass} min-w-0`}>{project.title}</h1>
        </div>
        <p className="mt-6 max-w-[76ch] text-lg leading-relaxed text-ink">{project.summary}</p>
        {project.relatedProjects?.length ? <div className="mt-5"><ProjectRelations project={project} /></div> : null}
        <dl className="case-facts">
          <div><dt className={monoLabelClass}>Delivery</dt><dd>{project.deliveryStatus}</dd></div>
          <div><dt className={monoLabelClass}>My role</dt><dd>{project.role}</dd></div>
          <div><dt className={monoLabelClass}>Period</dt><dd>{project.periodLabel}</dd></div>
        </dl>
        <div className="mt-6 flex flex-wrap items-center gap-5">
          {project.repoUrl ? <a className={secondaryButtonClass} href={project.repoUrl} rel="noreferrer" target="_blank"><Icon name="gitea" />View source</a> : null}
          {project.liveUrl ? <a className={textLinkClass} href={project.liveUrl} rel="noreferrer" target="_blank"><Icon name="external" />Open {project.title}</a> : null}
        </div>
        <ul className={tagListClass}>
          {project.stack.map((item) => <li key={item} className={tagClass}>{item}</li>)}
        </ul>
      </header>

      {project.collections?.length ? <section className="mt-10" aria-labelledby="collections-heading" id="collections">
        <SectionLabel>Built on Arkhiv</SectionLabel>
        <h2 className="mt-5 font-display text-3xl font-bold text-heading" id="collections-heading">Collections with their own identity.</h2>
        <p className="mt-4 max-w-[72ch] leading-relaxed text-ink-soft">The shared engine sits behind independent print, audio, and video frontends. Source credits and access rules stay with each collection.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {project.collections.map((collection) => <article className="archive-tile" key={collection.slug}>
            {collection.thumbnailUrl ? <img alt={`${collection.title} interface`} className="aspect-[16/10] w-full border-b-2 border-stroke object-cover object-top" decoding="async" height={800} loading="lazy" src={collection.thumbnailUrl} width={1280} /> : null}
            <div className="grid gap-4 p-5">
              <div className="flex items-center gap-3">
                {collection.logoUrl ? <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center border border-stroke p-2" style={{ backgroundColor: collection.brandBackground }}><img alt="" className="h-full w-full object-contain" height={40} src={collection.logoUrl} width={40} /></span> : null}
                <h3 className="font-display text-xl font-bold text-heading">{collection.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">{collection.summary}</p>
              <a className={textLinkClass} href={collection.url} rel="noreferrer" target="_blank">Open collection<Icon name="external" /></a>
            </div>
          </article>)}
        </div>
      </section> : null}

      <article className="case-story">
        <SectionLabel>Problem and ownership</SectionLabel>
        <h2 className="mt-6 max-w-[30ch] font-display text-[clamp(2rem,3.4vw,2.9rem)] font-bold leading-tight tracking-[-0.04em] text-heading">
          {flagshipProblemHeadings[project.slug] || 'The problem it solves.'}
        </h2>
        <div className="mt-6 grid gap-6 text-lg leading-relaxed text-ink-soft lg:grid-cols-2">
          <p>{project.problem}</p><p>{project.description}</p>
        </div>
      </article>
      {project.highlights.length > 0 ? (
        <section className="mt-10" aria-labelledby="built-heading">
          <h2 className="font-display text-3xl font-bold text-heading" id="built-heading">What I built.</h2>
          <ul className="mt-6 grid list-none gap-4 p-0 text-ink-soft md:grid-cols-2 xl:grid-cols-3">
            {project.highlights.map((highlight) => <li className={`${surfaceCardClass} p-6 leading-relaxed`} key={highlight}>{highlight}</li>)}
          </ul>
        </section>
      ) : null}

      {project.architecture.length > 0 ? (
        <section className="mt-16 grid gap-8 border-t border-stroke pt-10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:items-end">
            <div>
              <SectionLabel>Architecture</SectionLabel>
              <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading">
                Decisions and tradeoffs.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft lg:justify-self-end lg:text-right">
              What I chose, and what each choice cost.
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
        <section className="mt-16 grid gap-8 border-t border-stroke pt-10">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] lg:items-end">
            <div>
              <SectionLabel>Supporting media</SectionLabel>
              <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading">
                Screens and diagrams.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[1rem] leading-relaxed text-ink-soft lg:justify-self-end lg:text-right">
              Screenshots where there is something to screenshot, diagrams where there is not.
            </p>
          </div>

          <ProjectMediaGallery items={project.media} projectTitle={project.title} />
        </section>
      ) : null}

      {project.lessons.length > 0 ? (
        <section className="mt-16 grid gap-8 border-t border-stroke pt-10">
          <div>
            <SectionLabel>Lessons</SectionLabel>
            <h2 className="mt-6 font-display text-[2.5rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading">
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
            <h2 className="mt-5 font-display text-[2.25rem] font-bold leading-[0.95] tracking-[-0.04em] text-heading" id="case-study-contact-heading">Hiring for something like this?</h2>
            <p className="mt-4 max-w-[58ch] leading-relaxed text-ink-soft">Send me the role, the team, and what is broken or missing. A paragraph is enough.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className={primaryButtonClass} to="/contact">Tell me about a role</Link>
            <a className={secondaryButtonClass} download="Patrick_Fanella_Resume.pdf" href="/assets/patrick_fanella_resume.pdf">Download resume</a>
          </div>
        </section>
      ) : null}

      <div className="mt-10 border-t border-stroke pt-8">
        <Link className={textLinkClass} to="/projects">← Back to projects</Link>
      </div>
    </section>
  )
}

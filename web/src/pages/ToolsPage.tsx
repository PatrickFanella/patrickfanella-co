import { useMemo } from 'react'

import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { ToolCard } from '../components/ToolCard'
import { getErrorMessage } from '../lib/errors'
import {
  monoLabelClass,
  pageIntroClass,
  pageSectionClass,
  pageTitleClass,
  secondaryButtonClass,
  surfaceCardClass,
} from '../lib/styles'
import { useProjects } from '../lib/useProjects'

export function ToolsPage() {
  const { projects, status, error, retry } = useProjects()
  const tools = projects.filter((project) => project.kind === 'tool')
  const featuredTools = useMemo(() => {
    const explicitFeaturedTools = tools.filter((project) => project.featured)

    return explicitFeaturedTools.length > 0 ? explicitFeaturedTools : tools.slice(0, 3)
  }, [tools])
  const featuredToolSlugs = new Set(featuredTools.map((project) => project.slug))
  const archiveTools = tools.filter((project) => !featuredToolSlugs.has(project.slug))
  const featuredCountLabel = featuredTools.length === 1 ? 'featured tool' : 'featured tools'
  const archiveCountLabel = archiveTools.length === 1 ? 'source archive entry' : 'source archive entries'
  const toolsError = getErrorMessage(error, 'Please try again in a moment.')

  return (
    <section className={`${pageSectionClass} pt-4`}>
      <Seo
        description="Browse Patrick Fanella's public tools, led by featured repos and followed by a compact source archive."
        path="/tools"
        title="Tools"
      />
      <div className="mb-10 grid gap-8 border-b-2 border-stroke pb-12 md:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.85fr)] md:items-start">
        <div>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>Tools</h1>
          <p className={pageIntroClass}>
            Compact public utilities, services, CLIs, and automation helpers live here. Start with featured repos, then browse the source archive.
          </p>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
          <p className={monoLabelClass}>Featured first</p>
          <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
            {status === 'success' && tools.length > 0 ? (
              <>
                {featuredTools.length} {featuredCountLabel} and {archiveTools.length} {archiveCountLabel} are available. Each card links directly to the repository.
              </>
            ) : (
              <>Counts appear after the tool index loads. Each card links directly to the repository.</>
            )}
          </p>
        </aside>
      </div>

      {status === 'loading' ? (
        <div className="grid gap-6">
          <RouteState
            ariaLive="polite"
            description="Loading tool index."
            label="Loading"
            role="status"
            title="Tool index incoming."
          />

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <article key={index} className={`${surfaceCardClass} p-6`}>
                <div className="grid gap-5 border-b-2 border-stroke pb-5">
                  <div className="h-7 w-28 border-2 border-stroke bg-panel" />
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
          actions={<button className={secondaryButtonClass} onClick={retry} type="button">Try Again</button>}
          description={toolsError}
          label="Unavailable"
          role="alert"
          title="The tool index couldn't be loaded."
        />
      ) : null}

      {status === 'success' && tools.length === 0 ? (
        <RouteState
          description="The tools archive is online, but no public tools have been published yet."
          label="No tools yet"
          title="The archive is empty."
        />
      ) : null}

      {status === 'success' && tools.length > 0 ? (
        <div className="grid gap-14">
          {featuredTools.length > 0 ? (
            <section className="grid gap-5" aria-labelledby="featured-tools-heading">
              <div>
                <h2 id="featured-tools-heading" className={monoLabelClass}>
                  Featured Tools
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  {featuredTools.length} featured repo{featuredTools.length === 1 ? '' : 's'} leading the shelf.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {featuredTools.map((project) => (
                  <ToolCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          ) : null}

          {archiveTools.length > 0 ? (
            <section className="grid gap-5" aria-labelledby="source-archive-heading">
              <div>
                <h2 id="source-archive-heading" className={monoLabelClass}>
                  Source Archive
                </h2>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  {archiveTools.length} source archive entr{archiveTools.length === 1 ? 'y' : 'ies'} ready when you want the repo.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {archiveTools.map((project) => (
                  <ToolCard key={project.slug} density="archive" project={project} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

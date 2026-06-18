import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/SEO'
import { WorkMediaPlaceholder } from '../components/WorkMediaPlaceholder'
import { DiagramGrid } from '../components/DiagramFrame'
import { diagramsForProject } from '../data/diagrams'
import { assetsFor } from '../data/project-assets'
import {
  primaryThemeForProject,
  projectsBySlug,
  relatedProjectsByTheme,
  themeLabel,
  themesForProject,
} from '../data/portfolio'
import type { CareerThemeId, Project } from '../lib/types'
import { statusBadges, typeLabel } from '../lib/project-utils'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

type LayoutMode = 'infographic' | 'article'

export function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const project = projectsBySlug[slug]
  const reduced = usePrefersReducedMotion()
  const [params, setParams] = useSearchParams()
  const layout = (params.get('layout') === 'article' ? 'article' : 'infographic') as LayoutMode

  if (!project) {
    return (
      <div className="container-page py-24 text-center">
        <SEO title="Project not found | Patrick Fanella" />
        <p className="section-kicker">404</p>
        <h1 className="mt-3 text-3xl md:text-4xl font-display font-semibold tracking-tight">This case study isn't available.</h1>
        <p className="mt-3 text-[color:var(--color-fg-muted)]">It may have moved into the archive or never shipped publicly.</p>
        <Link to="/projects" className="mt-6 inline-flex btn-primary">
          Back to projects
        </Link>
      </div>
    )
  }

  const badges = statusBadges(project)
  const themes = themesForProject(project)
  const primaryTheme = primaryThemeForProject(project)
  const heroMedia = project.media[0]
  const gallery = project.media.slice(1)
  const diagrams = diagramsForProject(project.slug)
  const assets = assetsFor(project.slug)

  return (
    <>
      <SEO title={`${project.title} | Patrick Fanella`} description={project.summary} />

      <article className="container-page py-10 lg:py-14">
        <Link to="/projects" className="inline-flex items-center gap-1 text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]">
          <span aria-hidden>←</span> Projects
        </Link>

        <header className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 items-start">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.99, y: 8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45 }}
            className="space-y-4"
          >
            <WorkMediaPlaceholder
              title={project.title}
              kicker={`${typeLabel(project)} · ${project.year}`}
              summary={project.summary}
              caption={heroMedia?.caption ?? 'Hero visual for this project.'}
              accent={project.kind === 'tool' ? 'amber' : project.featured ? 'violet' : 'green'}
              className="h-full"
              src={assets.hero ?? assets.thumbSquare}
              video={assets.video}
            />

            <div className="panel p-5 lg:p-6">
              <p className="section-kicker">Why it exists</p>
              <p className="mt-3 text-[color:var(--color-fg)]/92 leading-relaxed">
                <strong className="text-[color:var(--color-fg)]">{leadSentence(project.description)}</strong>
                {restOfSentence(project.description)}
              </p>
            </div>
          </motion.div>

          <aside className="panel p-5 lg:p-6 space-y-5 lg:sticky lg:top-20">
            <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
              <span>{typeLabel(project)}</span>
              <span aria-hidden>·</span>
              <span>{project.year}</span>
              <span aria-hidden>·</span>
              <span>{project.role}</span>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight leading-[0.96]">{project.title}</h1>
              <p className="mt-4 text-[color:var(--color-fg-muted)] leading-relaxed">{project.summary}</p>
            </div>

            <LayoutToggle
              value={layout}
              onChange={(next) => {
                setParams(buildLayoutParams(params, next), { replace: true })
              }}
            />

            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span key={badge} className="chip text-[11px] uppercase tracking-[0.16em]">
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {themes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {themes.map((themeId) => (
                  <Link key={themeId} to={`/projects?category=${themeId}`} className="chip text-[11px] hover:text-[color:var(--color-fg)]">
                    {themeLabel(themeId)}
                  </Link>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <InfoCard label="Role" value={project.role} />
              <InfoCard label="Year" value={String(project.year)} />
              <InfoCard label="Primary theme" value={themeLabel(primaryTheme)} span={2} />
              <InfoCard label="Stack" value={project.stack.slice(0, 4).join(' · ')} span={2} />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Live demo
                  <span aria-hidden>↗</span>
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                  Repo
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </aside>
        </header>

        <div className="mt-10 lg:mt-12">
          {layout === 'infographic' ? <InfographicLayout project={project} gallery={gallery} diagrams={diagrams} figures={assets.figures} /> : <ArticleLayout project={project} gallery={gallery} diagrams={diagrams} figures={assets.figures} />}
        </div>

        <RelatedWorkSection project={project} primaryTheme={primaryTheme} />
      </article>
    </>
  )
}

function InfographicLayout({ project, gallery, diagrams, figures }: { project: Project; gallery: Project['media']; diagrams: ReturnType<typeof diagramsForProject>; figures: string[] }) {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="section-kicker">Snapshot</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <StatCard label="Core summary" value={project.summary} accent />
          <StatCard label="What shipped" value={project.highlights[0] ?? 'End-to-end production work.'} />
          <StatCard label="What matters" value={project.highlights[1] ?? project.highlights[0] ?? 'Proof that the system works in the real world.'} />
        </div>
      </section>

      <section>
        <h2 className="section-kicker">Proof points</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {project.highlights.map((point) => (
            <Callout key={point} text={point} />
          ))}
        </div>
      </section>

      {project.architecture && project.architecture.length > 0 && (
        <section>
          <h2 className="section-kicker">System diagram</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {project.architecture.map((item, index) => (
              <div key={item} className="panel p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] text-xs font-mono text-[color:var(--color-fg-muted)]">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold leading-tight">{item.split(':')[0]}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <DiagramGrid diagrams={diagrams} heading="Diagrams" />

      {project.lessons && project.lessons.length > 0 && (
        <section>
          <h2 className="section-kicker">Lessons</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {project.lessons.map((lesson) => (
              <div key={lesson} className="panel p-4 flex gap-3">
                <span aria-hidden className="mt-2 h-2 w-2 rounded-full bg-[color:var(--color-accent)] shrink-0" />
                <p className="text-sm leading-relaxed text-[color:var(--color-fg)]/92">{lesson}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {figures.length > 0 ? (
        <section>
          <h2 className="section-kicker">Visuals</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {figures.map((src, index) => (
              <WorkMediaPlaceholder
                key={src}
                title={`${project.title} — figure ${index + 1}`}
                kicker={`Figure ${index + 1}`}
                summary={project.summary}
                caption={gallery[index]?.caption}
                accent="violet"
                variant="wide"
                src={src}
              />
            ))}
          </div>
        </section>
      ) : gallery.length > 0 ? (
        <section>
          <h2 className="section-kicker">Visuals</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {gallery.map((media, index) => (
              <MediaFigure key={`${media.alt}-${index}`} media={media} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

function ArticleLayout({ project, gallery, diagrams, figures }: { project: Project; gallery: Project['media']; diagrams: ReturnType<typeof diagramsForProject>; figures: string[] }) {
  const topMedia = gallery[0]
  const bottomMedia = gallery[1]
  const topFigure = figures[0]
  const bottomFigure = figures[1]

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="min-w-0 space-y-8">
        <section className="space-y-4">
          <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed">
            <strong className="text-[color:var(--color-fg)]">{project.role}</strong> · {project.year} · {themeLabel(primaryThemeForProject(project))}
          </p>
          <p className="text-[color:var(--color-fg)]/92 leading-relaxed">
            {project.description}
          </p>
          {project.highlights[0] && <PullQuote text={project.highlights[0]} />}
        </section>

        {topFigure ? (
          <WorkMediaPlaceholder
            title={`${project.title} — figure 1`}
            kicker="Figure"
            summary={project.summary}
            caption={topMedia?.caption}
            accent="violet"
            variant="inline"
            src={topFigure}
          />
        ) : (
          topMedia && (
            <MediaFigure
              media={topMedia}
              compact
              note="Integrated visual — place a screenshot, diagram, or short gif here when the asset is created."
            />
          )
        )}

        <section className="space-y-3">
          <h2 className="section-kicker">What shipped</h2>
          <div className="space-y-3 text-[color:var(--color-fg)]/92 leading-relaxed">
            {project.highlights.map((point) => (
              <p key={point}>
                <strong className="text-[color:var(--color-fg)]">•</strong> {point}
              </p>
            ))}
          </div>
        </section>

        {project.architecture && project.architecture.length > 0 && (
          <section className="space-y-3">
            <h2 className="section-kicker">How it works</h2>
            <div className="space-y-3">
              {project.architecture.map((item, index) => (
                <div key={item} className="panel p-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-border-strong)] text-xs font-mono text-[color:var(--color-fg-muted)]">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[color:var(--color-fg)]">{item.split(':')[0]}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">{item}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {bottomFigure ? (
          <WorkMediaPlaceholder
            title={`${project.title} — figure 2`}
            kicker="Figure"
            summary={project.summary}
            caption={bottomMedia?.caption}
            accent="violet"
            variant="inline"
            src={bottomFigure}
          />
        ) : (
          bottomMedia && <MediaFigure media={bottomMedia} compact />
        )}

        <DiagramGrid diagrams={diagrams} heading="Diagrams" />

        {project.lessons && project.lessons.length > 0 && (
          <section className="space-y-3">
            <h2 className="section-kicker">What I learned</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {project.lessons.map((lesson) => (
                <div key={lesson} className="panel p-4">
                  <p className="text-sm leading-relaxed text-[color:var(--color-fg)]/92">{lesson}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
        <InfoCard label="Primary focus" value={themeLabel(primaryThemeForProject(project))} />
        <InfoCard label="Stack depth" value={project.stack.join(' · ')} />
        <InfoCard label="Status" value={statusBadges(project).join(' · ') || 'Built and shipped'} />

        <div className="panel p-4">
          <h3 className="text-sm uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">Quick read</h3>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg-muted)]">
            Skim the bold labels, then jump into the visuals. The article mode is meant to feel like a magazine spread instead of a long form dump.
          </p>
        </div>
      </aside>
    </div>
  )
}

function RelatedWorkSection({ project, primaryTheme }: { project: Project; primaryTheme: CareerThemeId }) {
  const themeRef = useRef<HTMLDivElement | null>(null)
  const [selectedTheme, setSelectedTheme] = useState(primaryTheme)

  useEffect(() => {
    setSelectedTheme(primaryTheme)
  }, [primaryTheme])

  const relatedProjects = useMemo(() => relatedProjectsByTheme(project, selectedTheme, 8), [project, selectedTheme])
  const chipThemes = useMemo(() => {
    const ordered = [primaryTheme, ...themesForProject(project)]
    return Array.from(new Set(ordered))
  }, [primaryTheme, project])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!themeRef.current) return
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()

    const container = themeRef.current
    const cardWidth = 320
    const delta = event.key === 'ArrowLeft' ? -cardWidth : cardWidth

    if (event.key === 'Home') {
      container.scrollTo({ left: 0, behavior: 'smooth' })
      return
    }

    if (event.key === 'End') {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
      return
    }

    container.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <section className="mt-20 pt-10 border-t border-[color:var(--color-border)]/70">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Related work</p>
          <h2 className="mt-3 text-2xl md:text-3xl font-display font-semibold tracking-tight">More like this, one row at a time.</h2>
        </div>
        <Link to="/projects" className="text-sm text-[color:var(--color-accent-soft)] hover:underline">
          Back to projects →
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {chipThemes.map((themeId) => {
          const active = selectedTheme === themeId
          return (
            <button
              key={themeId}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedTheme(themeId)}
              className={`chip transition-colors ${active ? 'chip-active' : 'hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)]'}`}
            >
              {themeLabel(themeId)}
            </button>
          )
        })}
      </div>

      <div
        ref={themeRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label="Related projects"
        className="mt-6 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] rounded-[var(--radius-lg)]"
      >
        {relatedProjects.map((related) => (
          <Link
            key={related.slug}
            to={`/projects/${related.slug}`}
            className="panel min-w-[18rem] max-w-[18rem] shrink-0 p-4 snap-start hover:border-[color:var(--color-border-strong)] transition-colors"
          >
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
              {typeLabel(related)} · {related.year}
            </div>
            <h3 className="mt-2 text-lg font-semibold tracking-tight">{related.title}</h3>
            <p className="mt-1 text-sm text-[color:var(--color-fg-muted)] leading-relaxed line-clamp-3">{related.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function LayoutToggle({ value, onChange }: { value: LayoutMode; onChange: (value: LayoutMode) => void }) {
  return (
    <div className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] p-1 flex gap-1">
      {[
        { id: 'infographic', label: 'Infographic' },
        { id: 'article', label: 'Article' },
      ].map((option) => {
        const active = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id as LayoutMode)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${active ? 'bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)]' : 'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]'}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function buildLayoutParams(params: URLSearchParams, layout: LayoutMode) {
  const next = new URLSearchParams(params)
  next.set('layout', layout)
  return next
}

function leadSentence(text: string) {
  const match = text.match(/^(.+?[.!?])\s+/)
  return match?.[1] ?? text
}

function restOfSentence(text: string) {
  const first = leadSentence(text)
  return text.startsWith(first) ? text.slice(first.length) : ''
}

function StatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`panel p-5 ${accent ? 'border-[color:var(--color-accent)]/40 bg-[color:var(--color-accent)]/8' : ''}`.trim()}>
      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">{label}</div>
      <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-fg)]/92">{value}</p>
    </div>
  )
}

function Callout({ text }: { text: string }) {
  return (
    <div className="panel p-4 flex gap-3">
      <span aria-hidden className="mt-2 h-2 w-2 rounded-full bg-[color:var(--color-accent)] shrink-0" />
      <p className="text-sm leading-relaxed text-[color:var(--color-fg)]/92">{text}</p>
    </div>
  )
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="panel-strong p-5 border-l-4 border-[color:var(--color-accent)]">
      <p className="text-lg md:text-xl font-display leading-snug text-[color:var(--color-fg)]">
        <span className="text-[color:var(--color-accent-soft)]">“</span>{text}<span className="text-[color:var(--color-accent-soft)]">”</span>
      </p>
    </blockquote>
  )
}

function MediaFigure({ media, compact = false, note }: { media: Project['media'][number]; compact?: boolean; note?: string }) {
  return (
    <WorkMediaPlaceholder
      title={media.alt}
      kicker="Placeholder visual"
      summary={media.alt}
      caption={media.caption ?? note ?? 'Replace with a real asset later.'}
      accent="violet"
      variant={compact ? 'inline' : 'wide'}
    />
  )
}

function InfoCard({ label, value, span = 1 }: { label: string; value: string; span?: number }) {
  return (
    <div className={`panel p-4 ${span === 2 ? 'md:col-span-2' : ''}`.trim()}>
      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">{label}</div>
      <div className="mt-2 text-sm text-[color:var(--color-fg)]/92 leading-relaxed">{value}</div>
    </div>
  )
}

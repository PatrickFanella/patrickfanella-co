import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { curatedSets, projectsForCuratedSet, primaryThemeForProject, themeLabel } from '../data/portfolio'
import type { Project } from '../lib/types'
import { statusBadges } from '../lib/project-utils'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { WorkMediaPlaceholder } from './WorkMediaPlaceholder'
import { assetsFor } from '../data/project-assets'

const AUTO_ADVANCE_MS = 8500
const DRAG_THRESHOLD_RATIO = 0.18
const DRAG_VELOCITY = 900

export function HeroCarousel() {
  const reduced = usePrefersReducedMotion()
  const [setId, setSetId] = useState(curatedSets[0].id)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  const setProjects = useMemo(() => projectsForCuratedSet(setId), [setId])
  const total = setProjects.length
  const active = setProjects[index] ?? setProjects[0]
  const curated = curatedSets.find((item) => item.id === setId) ?? curatedSets[0]

  const go = useCallback(
    (next: number) => {
      if (total === 0) return
      setIndex(((next % total) + total) % total)
      setDragOffset(0)
    },
    [total],
  )

  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    if (reduced || paused || total <= 1) return
    const id = window.setTimeout(next, AUTO_ADVANCE_MS)
    return () => window.clearTimeout(id)
  }, [reduced, paused, total, next, index])

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  useEffect(() => {
    if (!active || !liveRegionRef.current) return
    liveRegionRef.current.textContent = `Showing ${active.title} — ${projectTagline(active)} from ${curated.label}. Slide ${index + 1} of ${total}.`
  }, [active, curated.label, index, total])

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prev()
      }
    },
    [next, prev],
  )

  if (!active) return null

  return (
    <section
      aria-label="Featured work"
      className="container-page py-8 lg:py-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={liveRegionRef} aria-live="polite" className="sr-only-focusable" />

      <div className="relative overflow-visible">
        <div aria-hidden className="pointer-events-none absolute inset-x-12 top-8 -z-10 h-56 rounded-full bg-[radial-gradient(circle,rgba(213,162,76,0.18),transparent_68%)] blur-3xl lg:inset-x-24 lg:top-10 lg:h-72" />
        <div className="border-b border-[color:var(--color-border)]/70 px-5 py-4 lg:px-6 lg:py-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">Portfolio overview</p>
              <h1 className="mt-3 text-4xl md:text-5xl xl:text-6xl leading-[0.94] font-display font-semibold tracking-tight">
                Shipping systems with a product brain.
              </h1>
              <p className="mt-4 max-w-2xl text-[color:var(--color-fg-muted)] text-base md:text-lg leading-relaxed">
                A compact portfolio for backend systems, AI workflows, developer tools, and production products — tuned for recruiters who want proof fast.
              </p>
            </div>

            <div className="panel-strong w-full max-w-2xl p-3 md:p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Choose a lens</p>
                  <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">Primary selector — bigger, louder, and meant to be used first.</p>
                </div>
                <div className="text-xs font-mono text-[color:var(--color-fg-dim)]">{curated.label}</div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {curatedSets.map((set) => {
                  const activeSet = set.id === setId
                  return (
                    <button
                      key={set.id}
                      type="button"
                      onClick={() => {
                        setSetId(set.id)
                        setIndex(0)
                        setDragOffset(0)
                      }}
                      aria-pressed={activeSet}
                      className={`rounded-[var(--radius-md)] border px-4 py-3 text-left transition-all ${activeSet ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/18 text-[color:var(--color-fg)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_28%,transparent)]' : 'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/80 text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border)] hover:text-[color:var(--color-fg)]'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-base">{set.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-mono">{set.slugs.length}</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed opacity-85">{set.takeaway}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative h-[34rem] overflow-visible lg:h-[38rem]"
          style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="absolute inset-0 overflow-visible [transform-style:preserve-3d]">
            {setProjects.map((project, slideIndex) => {
              const delta = signedDistance(slideIndex, index, total)
              const visibility = slideVisibility(delta)

              if (visibility.hidden) return null

              return (
                <SlideCard
                  key={project.slug}
                  project={project}
                  delta={delta}
                  reduced={reduced}
                  dragOffset={dragOffset}
                  active={delta === 0}
                  onActivate={() => go(slideIndex)}
                  onDragMove={(value) => setDragOffset(value)}
                  onDragEnd={(info, stageWidth) => {
                    const threshold = stageWidth * DRAG_THRESHOLD_RATIO
                    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > DRAG_VELOCITY) {
                      go(info.offset.x > 0 ? index - 1 : index + 1)
                      return
                    }
                    setDragOffset(0)
                  }}
                />
              )
            })}
          </div>

          <div className="absolute inset-x-4 bottom-4 z-40 flex items-center justify-between gap-4 lg:inset-x-6">
            <div className="flex gap-2">
              <button type="button" onClick={prev} aria-label="Previous work" className="chip hover:text-[color:var(--color-fg)]">
                ← Prev
              </button>
              <button type="button" onClick={next} aria-label="Next work" className="chip hover:text-[color:var(--color-fg)]">
                Next →
              </button>
            </div>

            <ol className="flex items-center gap-2" aria-label="Carousel position" role="list">
              {setProjects.map((project, slideIndex) => (
                <li key={project.slug}>
                  <button
                    type="button"
                    onClick={() => go(slideIndex)}
                    aria-label={`Go to ${project.title}`}
                    aria-current={slideIndex === index ? 'true' : undefined}
                    className={`h-2 rounded-full transition-all ${slideIndex === index ? 'w-8 bg-[color:var(--color-accent)]' : 'w-2 bg-[color:var(--color-border-strong)] hover:bg-[color:var(--color-fg-dim)]'}`}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

function SlideCard({
  project,
  delta,
  reduced,
  dragOffset,
  active,
  onActivate,
  onDragMove,
  onDragEnd,
}: {
  project: Project
  delta: number
  reduced: boolean
  dragOffset: number
  active: boolean
  onActivate: () => void
  onDragMove: (value: number) => void
  onDragEnd: (info: { offset: { x: number }; velocity: { x: number } }, stageWidth: number) => void
}) {
  const stageWidth = stageWidthEstimate()
  const visible = Math.abs(delta) < 3
  const neighbor = Math.abs(delta) === 1

  const x = reduced
    ? 0
    : active
      ? dragOffset
      : delta > 0
        ? delta === 1
          ? '58%'
          : '96%'
        : delta === -1
          ? '-58%'
          : '-96%'

  const rotateY = reduced
    ? 0
    : active
      ? 0
      : delta > 0
        ? delta === 1
          ? -35
          : -45
        : delta === -1
          ? 35
          : 45

  const z = reduced ? 0 : active ? 0 : neighbor ? -160 : -280
  const scale = reduced ? 1 : active ? 1 : neighbor ? 0.86 : 0.74
  const opacity = reduced ? 1 : active ? 1 : neighbor ? 0.7 : 0.45
  const zIndex = active ? 30 : neighbor ? 20 : 10

  return (
    <motion.div
      role="group"
      tabIndex={0}
      aria-label={`${project.title} — ${projectTagline(project)}`}
      aria-current={active ? 'true' : undefined}
      onClick={(event) => {
        const target = event.target as HTMLElement | null
        if (target?.closest('a,button')) return
        onActivate()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onActivate()
        }
      }}
      className="absolute left-1/2 top-1/2 w-[min(100%,72rem)] -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{
        zIndex,
        transformStyle: 'preserve-3d',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      animate={{
        x,
        rotateY,
        z,
        scale,
        opacity,
      }}
      transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      drag={active && !reduced ? 'x' : false}
      dragMomentum={false}
      dragElastic={0.12}
      onDrag={(_, info) => onDragMove(info.offset.x)}
      onDragEnd={(_, info) => onDragEnd(info, stageWidth)}
    >
      <div className="h-[28rem] lg:h-[32rem]">
        <OpenBookCard project={project} reduced={reduced} />
      </div>
    </motion.div>
  )
}

function OpenBookCard({ project, reduced }: { project: Project; reduced: boolean }) {
  const accent = project.kind === 'tool' ? 'amber' : project.featured ? 'violet' : 'green'
  const primaryTheme = themeLabel(primaryThemeForProject(project))
  const stackChips = project.stack.slice(0, 3)
  const assets = assetsFor(project.slug)

  return (
    <div className="relative h-full" style={{ transformStyle: 'preserve-3d' }}>
      <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
        <div className="relative flex min-h-0 items-stretch rounded-[var(--radius-lg)] bg-[color:var(--color-surface-2)] shadow-[var(--shadow-ambient)] [transform-style:preserve-3d] lg:[transform:perspective(1600px)_rotateY(12deg)] lg:origin-right">
          <div className="relative z-10 flex h-full w-full overflow-hidden rounded-[var(--radius-lg)]">
            <WorkMediaPlaceholder
              title={project.title}
              kicker={primaryTheme}
              summary={project.summary}
              caption={project.description}
              accent={accent}
              variant="wide"
              className="h-full w-full"
              src={assets.hero ?? assets.thumbSquare}
              video={assets.video}
            />
          </div>
        </div>

        <div className="relative flex min-h-0 items-stretch rounded-[var(--radius-lg)] bg-[color:var(--color-surface-2)] shadow-[var(--shadow-ambient)] [transform-style:preserve-3d] lg:[transform:perspective(1600px)_rotateY(-12deg)] lg:origin-left">
          <div className="flex h-full w-full flex-col justify-between gap-5 p-5 lg:p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
                <span>{project.kind === 'tool' ? 'Tool' : 'Project'}</span>
                <span aria-hidden>·</span>
                <span>{project.year}</span>
                <span aria-hidden>·</span>
                <span>{project.role}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight leading-[1]">{project.title}</h2>
                <p className="text-sm md:text-base leading-relaxed text-[color:var(--color-fg-muted)]">{projectTagline(project)}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="chip text-[11px] uppercase tracking-[0.16em]">{primaryTheme}</span>
                {stackChips.map((stack) => (
                  <Link key={stack} to={`/projects?stack=${encodeURIComponent(stack.toLowerCase())}`} className="chip text-[11px] hover:text-[color:var(--color-fg)]">
                    {stack}
                  </Link>
                ))}
              </div>

              <div className="space-y-2 border-t border-[color:var(--color-border)]/70 pt-4">
                {statusBadges(project).length > 0 && (
                  <p className="text-[11px] uppercase tracking-[0.18em] font-mono text-[color:var(--color-fg-dim)]">{statusBadges(project).join(' · ')}</p>
                )}
                {project.highlights.slice(0, 2).map((point) => {
                  const [lead, ...rest] = point.split(':')
                  return (
                    <p key={point} className="text-sm leading-relaxed text-[color:var(--color-fg)]/90">
                      <strong className="text-[color:var(--color-fg)]">{lead}</strong>
                      {rest.length > 0 ? `:${rest.join(':')}` : ''}
                    </p>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-[color:var(--color-border)]/70 pt-4">
              <div className="text-xs text-[color:var(--color-fg-dim)]">{reduced ? 'Flat card' : 'Coverflow book spread'}</div>
              <div className="flex items-center gap-2">
                <Link to={`/projects/${project.slug}`} className="btn-primary">
                  View
                  <span aria-hidden>→</span>
                </Link>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                    Live ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function signedDistance(index: number, activeIndex: number, total: number) {
  const raw = index - activeIndex
  const half = total / 2
  if (raw > half) return raw - total
  if (raw < -half) return raw + total
  return raw
}

function slideVisibility(delta: number) {
  return { hidden: Math.abs(delta) >= 3 }
}

function stageWidthEstimate() {
  if (typeof window === 'undefined') return 1600
  return Math.min(window.innerWidth, 1600)
}

function projectTagline(project: Project) {
  return project.summary
}

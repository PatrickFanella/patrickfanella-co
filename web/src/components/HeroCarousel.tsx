import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { curatedSets, projectsForCuratedSet, themeLabel, themesForProject } from '../data/portfolio'
import { statusBadges } from '../lib/project-utils'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { WorkMediaPlaceholder } from './WorkMediaPlaceholder'

const AUTO_ADVANCE_MS = 8500

export function HeroCarousel() {
  const reduced = usePrefersReducedMotion()
  const [setId, setSetId] = useState(curatedSets[0].id)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const liveRegionRef = useRef<HTMLDivElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const smoothX = useSpring(rawX, { stiffness: 130, damping: 18, mass: 0.35 })
  const smoothY = useSpring(rawY, { stiffness: 130, damping: 18, mass: 0.35 })
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [9, -9])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const driftX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const driftY = useTransform(smoothY, [-0.5, 0.5], [-10, 10])

  const setProjects = useMemo(() => projectsForCuratedSet(setId), [setId])
  const total = setProjects.length
  const active = setProjects[index] ?? setProjects[0]

  const go = useCallback(
    (next: number) => {
      if (total === 0) return
      setIndex(((next % total) + total) % total)
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') next()
      if (event.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  useEffect(() => {
    if (!active || !liveRegionRef.current) return
    liveRegionRef.current.textContent = `Showing ${active.title} from ${curatedSets.find((item) => item.id === setId)?.label ?? 'work'} — slide ${index + 1} of ${total}.`
  }, [active, index, setId, total])

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    rawX.set(Math.max(-0.5, Math.min(0.5, x / rect.width - 0.5)))
    rawY.set(Math.max(-0.5, Math.min(0.5, y / rect.height - 0.5)))
  }, [rawX, rawY])

  if (!active) return null

  const badges = active ? statusBadges(active) : []
  const themeNames = active ? themesForProject(active).slice(0, 3).map((themeId) => themeLabel(themeId)) : []
  const curated = curatedSets.find((item) => item.id === setId) ?? curatedSets[0]

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

      <div ref={stageRef} className="panel overflow-hidden" onPointerMove={handlePointerMove} onPointerLeave={() => { rawX.set(0); rawY.set(0) }} style={{ perspective: '1400px' }}>
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

        <div className="grid gap-0 lg:grid-cols-[0.98fr_1.02fr] lg:h-[38rem]">
          <div className="border-b lg:border-b-0 lg:border-r border-[color:var(--color-border)]/70 p-4 lg:p-6 flex items-stretch overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {active && (
                <motion.div
                  key={`${active.slug}-${setId}`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14, rotateY: -18, scale: 0.97 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, rotateY: 0, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -10, rotateY: 14, scale: 0.97 }}
                  transition={{ duration: reduced ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
                  style={{ x: driftX, y: driftY, rotateX, rotateY, transformStyle: 'preserve-3d' }}
                  className="w-full h-full"
                >
                  <WorkMediaPlaceholder
                    title={active.title}
                    kicker={curated.label}
                    summary={active.summary}
                    caption={curated.purpose}
                    accent={setId === 'ai-automation' ? 'green' : setId === 'devtools-infra' ? 'amber' : 'violet'}
                    className="h-full"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-5 lg:p-6 flex flex-col justify-between gap-5 min-h-0">
            <AnimatePresence mode="wait" initial={false}>
              {active && (
                <motion.div
                  key={`${active.slug}-copy`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.05 }}
                  className="min-h-0"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-mono text-[color:var(--color-fg-dim)]">
                    <span>{active.year}</span>
                    <span aria-hidden>·</span>
                    <span>{active.role}</span>
                    <span aria-hidden>·</span>
                    <span>{active.kind === 'tool' ? 'Tool' : 'Project'}</span>
                  </div>
                  <h2 className="mt-4 text-3xl md:text-4xl font-display font-semibold tracking-tight leading-[1]">
                    {active.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[color:var(--color-fg-muted)] text-base md:text-lg leading-relaxed line-clamp-4">
                    {active.summary}
                  </p>

                  {badges.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {badges.map((badge) => (
                        <span key={badge} className="chip text-[11px] uppercase tracking-[0.16em]">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {themeNames.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {themeNames.map((theme) => (
                        <span key={theme} className="chip text-[11px]">
                          {theme}
                        </span>
                      ))}
                    </div>
                  )}

                  {active.highlights.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {active.highlights.slice(0, 3).map((point) => (
                        <li key={point} className="flex gap-3 text-sm text-[color:var(--color-fg)]/92">
                          <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0" />
                          <span className="leading-relaxed">
                            {(() => {
                              const [lead, ...rest] = point.split(':')
                              return (
                                <>
                                  <strong className="text-[color:var(--color-fg)]">{lead}</strong>
                                  {rest.length > 0 ? `:${rest.join(':')}` : ''}
                                </>
                              )
                            })()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    <Link to={`/projects/${active.slug}`} className="btn-primary">
                      View case study
                      <span aria-hidden>→</span>
                    </Link>
                    {active.liveUrl && (
                      <a href={active.liveUrl} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                        Live demo
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                    {active.repoUrl && (
                      <a href={active.repoUrl} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                        Repo
                        <span aria-hidden>↗</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-border)]/70 pt-5 mt-auto">
              <div className="flex flex-wrap items-center gap-2">
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
      </div>
    </section>
  )
}

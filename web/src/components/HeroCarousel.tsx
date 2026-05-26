import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project } from '../lib/types'
import { statusBadges } from '../lib/project-utils'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

interface Props {
  projects: Project[]
}

const AUTO_ADVANCE_MS = 9000

export function HeroCarousel({ projects }: Props) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = projects.length
  const active = projects[index]
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  const go = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total)
    },
    [total],
  )
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  // Auto-advance, gentle, respects reduced motion + hover/focus pause.
  useEffect(() => {
    if (reduced || paused || total <= 1) return
    const id = window.setTimeout(next, AUTO_ADVANCE_MS)
    return () => window.clearTimeout(id)
  }, [reduced, paused, total, next, index])

  // Keyboard nav.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // Announce active slide.
  useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Showing ${active.title}, slide ${index + 1} of ${total}.`
    }
  }, [active, index, total])

  const adjacent = useMemo(() => {
    if (total <= 1) return [] as Project[]
    const items: Project[] = []
    const seen = new Set<number>([index])
    let offset = 1
    while (items.length < Math.min(3, total - 1)) {
      const i = (index + offset) % total
      if (!seen.has(i)) {
        items.push(projects[i])
        seen.add(i)
      }
      offset++
    }
    return items
  }, [index, total, projects])

  const badges = statusBadges(active)
  const heroImage = active.media[0]?.src ?? '/assets/projects/project-fallback.svg'
  const heroAlt = active.media[0]?.alt ?? `${active.title} screenshot`

  return (
    <section
      aria-label="Featured project"
      className="relative isolate min-h-[calc(100svh-3.5rem)] flex flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* ambient gradient */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_30%,rgba(124,92,255,0.18),transparent_60%),radial-gradient(50%_40%_at_20%_80%,rgba(92,224,168,0.10),transparent_60%)]"
      />
      <div ref={liveRegionRef} aria-live="polite" className="sr-only-focusable" />

      <div className="container-page flex-1 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 py-8 lg:py-12">
        {/* SCREENSHOT */}
        <div className="relative order-2 lg:order-1 flex items-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.slug}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.99, y: -6 }}
              transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden surface-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]"
            >
              <Link
                to={`/projects/${active.slug}`}
                aria-label={`Open ${active.title} project page`}
                className="absolute inset-0 group"
              >
                <img
                  src={heroImage}
                  alt={heroAlt}
                  loading="eager"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--color-bg)]/40 via-transparent to-transparent pointer-events-none" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* COPY */}
        <div className="order-1 lg:order-2 flex flex-col justify-center max-w-xl">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.slug + '-copy'}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.08 }}
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">
                Featured · {active.year}
              </p>
              <h1 className="mt-3 text-4xl md:text-5xl xl:text-6xl font-semibold tracking-tight leading-[1.05]">
                {active.title}
              </h1>
              <p className="mt-5 text-base md:text-lg text-[color:var(--color-fg-muted)] leading-relaxed">
                {active.summary}
              </p>

              {/* badges */}
              {badges.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {badges.map((b) => (
                    <span
                      key={b}
                      className="text-[11px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-fg-muted)]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* stack */}
              {active.stack.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {active.stack.slice(0, 8).map((s) => (
                    <li
                      key={s}
                      className="text-[11px] font-mono px-2 py-1 rounded-md bg-[color:var(--color-bg-elev-2)] text-[color:var(--color-fg-muted)]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              {/* proof points */}
              {active.highlights.length > 0 && (
                <ul className="mt-6 space-y-2.5">
                  {active.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[color:var(--color-fg)]/90">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0"
                      />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* actions */}
              <div className="mt-7 flex flex-wrap items-center gap-2">
                <Link
                  to={`/projects/${active.slug}`}
                  className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] font-medium px-4 py-2.5 hover:bg-[color:var(--color-accent-soft)] transition-colors"
                >
                  View Project
                  <span aria-hidden>→</span>
                </Link>
                {active.liveUrl && (
                  <a
                    href={active.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border-strong)] px-4 py-2.5 text-sm hover:bg-[color:var(--color-bg-elev)] transition-colors"
                  >
                    Live Demo
                    <span aria-hidden>↗</span>
                  </a>
                )}
                {active.repoUrl && (
                  <a
                    href={active.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border-strong)] px-4 py-2.5 text-sm hover:bg-[color:var(--color-bg-elev)] transition-colors"
                  >
                    GitHub
                    <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="container-page pb-6 lg:pb-8 flex items-center justify-between gap-4">
        {/* adjacent previews */}
        <ul className="hidden md:flex items-center gap-3" role="list">
          {adjacent.map((p) => {
            const realIndex = projects.findIndex((x) => x.slug === p.slug)
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => go(realIndex)}
                  className="group flex items-center gap-3 rounded-lg p-1.5 pr-3 border border-transparent hover:border-[color:var(--color-border)] hover:bg-[color:var(--color-bg-elev)] transition-all"
                  aria-label={`Show ${p.title}`}
                >
                  <span className="block h-12 w-20 rounded-md overflow-hidden bg-[color:var(--color-bg-elev-2)] border border-[color:var(--color-border)]">
                    <img
                      src={p.media[0]?.src ?? '/assets/projects/project-fallback.svg'}
                      alt=""
                      className="h-full w-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                    />
                  </span>
                  <span className="flex flex-col items-start">
                    <span className="text-xs text-[color:var(--color-fg)] font-medium">{p.title}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[color:var(--color-fg-dim)]">
                      {p.liveUrl ? 'Live' : p.kind === 'tool' ? 'Tool' : 'Case Study'}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3 ml-auto">
          {/* dots */}
          <ol className="flex items-center gap-1.5" role="list" aria-label="Slide indicators">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}: ${p.title}`}
                  aria-current={i === index ? 'true' : undefined}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? 'w-6 bg-[color:var(--color-accent)]'
                      : 'w-1.5 bg-[color:var(--color-border-strong)] hover:bg-[color:var(--color-fg-dim)]'
                  }`}
                />
              </li>
            ))}
          </ol>
          {/* arrows */}
          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous project"
              className="h-9 w-9 grid place-items-center rounded-md border border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev)] transition-colors"
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next project"
              className="h-9 w-9 grid place-items-center rounded-md border border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev)] transition-colors"
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { curatedSets, projectsForCuratedSet } from '../data/portfolio'
import type { CuratedSetId } from '../lib/types'

export function ProjectSelection() {
  const [setId, setSetId] = useState<CuratedSetId>('featured-systems')
  const activeSet = curatedSets.find((set) => set.id === setId) ?? curatedSets[0]

  const visible = useMemo(() => projectsForCuratedSet(setId).slice(0, 6), [setId])

  return (
    <section id="selection" aria-labelledby="selection-heading" className="container-page py-14 lg:py-18">
      <div className="panel p-5 md:p-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker">Selected work</p>
            <h2 id="selection-heading" className="mt-3 text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Curated sets for fast review.
            </h2>
            <p className="mt-3 text-[color:var(--color-fg-muted)] leading-relaxed">
              Three angles into the portfolio: featured systems, AI & automation, and dev tools & infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 xl:min-w-[31rem] xl:justify-end">
            {curatedSets.map((set) => {
              const active = set.id === setId
              return (
                <button
                  key={set.id}
                  type="button"
                  onClick={() => setSetId(set.id)}
                  aria-pressed={active}
                  className={`min-w-[9rem] rounded-[var(--radius-md)] border px-4 py-3 text-left transition-all ${active ? 'border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/16 text-[color:var(--color-fg)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_24%,transparent)]' : 'border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)]/80 text-[color:var(--color-fg-muted)] hover:border-[color:var(--color-border)] hover:text-[color:var(--color-fg)]'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{set.label}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono">{set.slugs.length}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed opacity-85">{set.takeaway}</p>
                </button>
              )
            })}
          </div>
        </header>

        <div className="mt-6 grid gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {visible.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/80 px-4 py-3 text-sm text-[color:var(--color-fg-muted)]">
          <div>
            <strong className="text-[color:var(--color-fg)]">{activeSet.label}</strong> · {activeSet.purpose}
          </div>
          <div className="flex gap-3">
            <Link to="/projects" className="text-[color:var(--color-accent-soft)] hover:underline">
              Browse projects →
            </Link>
            <Link to="/contact" className="text-[color:var(--color-accent-soft)] hover:underline">
              Start a conversation →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

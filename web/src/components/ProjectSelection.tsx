import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import {
  curatedSets,
  categories,
  techFilters,
  categoriesForProject,
  projectMatchesTech,
  projectsBySlug,
  projects as allProjects,
} from '../data/portfolio'
import type { CategoryId, CuratedSetId } from '../lib/types'

type CatFilter = 'all' | CategoryId

export function ProjectSelection() {
  const [setId, setSetId] = useState<CuratedSetId>('featured-systems')
  const [cat, setCat] = useState<CatFilter>('all')
  const [tech, setTech] = useState<string | null>(null)

  const activeSet = curatedSets.find((s) => s.id === setId)!

  const visible = useMemo(() => {
    const baseSlugs = new Set(activeSet.slugs)
    let pool = activeSet.slugs.map((s) => projectsBySlug[s]).filter(Boolean)
    // If category or tech is applied, broaden to all projects, then filter.
    if (cat !== 'all' || tech) {
      pool = allProjects.filter((p) => baseSlugs.has(p.slug) || cat !== 'all' || tech)
    }
    let out = pool
    if (cat !== 'all') {
      out = out.filter((p) => categoriesForProject(p).includes(cat))
    }
    if (tech) {
      out = out.filter((p) => projectMatchesTech(p, tech))
    }
    return out.slice(0, 8)
  }, [activeSet, cat, tech])

  return (
    <section id="selection" aria-labelledby="selection-heading" className="container-page py-20 lg:py-28">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">
          Browse the work
        </p>
        <h2 id="selection-heading" className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
          Project selection
        </h2>
        <p className="mt-3 text-[color:var(--color-fg-muted)]">
          Pick a curated set or filter by category and technology. The hero stays focused on the strongest work; this is where you steer.
        </p>
      </header>

      {/* curated sets */}
      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        {curatedSets.map((s) => {
          const active = s.id === setId
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSetId(s.id)}
              aria-pressed={active}
              className={`text-left p-5 rounded-xl border transition-colors ${
                active
                  ? 'border-[color:var(--color-accent)] bg-[color:var(--color-bg-elev-2)]'
                  : 'border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] hover:border-[color:var(--color-border-strong)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{s.label}</span>
                {active && <span aria-hidden className="h-2 w-2 rounded-full bg-[color:var(--color-accent)]" />}
              </div>
              <p className="mt-2 text-xs text-[color:var(--color-fg-muted)]">{s.purpose}</p>
              <p className="mt-2 text-[11px] text-[color:var(--color-fg-dim)] italic">"{s.takeaway}"</p>
            </button>
          )
        })}
      </div>

      {/* filters */}
      <div className="mt-8 flex flex-col gap-4">
        <FilterRow
          label="Category"
          options={[{ id: 'all' as CatFilter, label: 'All' }, ...categories.map((c) => ({ id: c.id as CatFilter, label: c.label }))]}
          value={cat}
          onChange={setCat}
        />
        <FilterRow
          label="Stack"
          options={[{ id: null, label: 'Any' }, ...techFilters.map((t) => ({ id: t as string | null, label: t }))]}
          value={tech}
          onChange={setTech}
        />
      </div>

      {/* cards */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <div className="md:col-span-2 xl:col-span-3 surface p-10 text-center text-[color:var(--color-fg-muted)]">
            No projects match those filters.
          </div>
        )}
        <Link
          to="/projects"
          className="group surface flex items-center justify-center p-8 text-center hover:bg-[color:var(--color-bg-elev-2)] transition-colors min-h-[200px]"
        >
          <div>
            <div className="text-lg font-semibold">View all projects</div>
            <div className="mt-1 text-sm text-[color:var(--color-fg-muted)]">
              {allProjects.length} projects and tools — gallery, directory, and table modes
            </div>
            <div className="mt-3 text-[color:var(--color-accent-soft)] text-sm group-hover:translate-x-0.5 transition-transform inline-block">
              Browse the archive →
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}

interface RowProps<T> {
  label: string
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}
function FilterRow<T>({ label, options, value, onChange }: RowProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider text-[color:var(--color-fg-dim)] font-mono mr-2">
        {label}
      </span>
      {options.map((opt) => {
        const active = opt.id === value
        return (
          <button
            key={String(opt.id)}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              active
                ? 'bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] border-[color:var(--color-accent)]'
                : 'border-[color:var(--color-border-strong)] text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] hover:bg-[color:var(--color-bg-elev)]'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

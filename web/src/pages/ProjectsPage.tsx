import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { ProjectCard } from '../components/ProjectCard'
import {
  allProjectsSorted,
  categories,
  techFilters,
  categoriesForProject,
  projectMatchesTech,
} from '../data/portfolio'
import type { CategoryId, Project } from '../lib/types'
import { typeLabel, statusBadges } from '../lib/project-utils'

type ViewMode = 'gallery' | 'directory' | 'table'
type CatFilter = 'all' | CategoryId
type KindFilter = 'all' | 'case-study' | 'tool'

export function ProjectsPage() {
  const [params, setParams] = useSearchParams()
  const initialCat = (params.get('category') as CatFilter) || 'all'

  const [view, setView] = useState<ViewMode>('gallery')
  const [cat, setCat] = useState<CatFilter>(initialCat)
  const [kind, setKind] = useState<KindFilter>('all')
  const [tech, setTech] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return allProjectsSorted.filter((p) => {
      if (kind !== 'all' && p.kind !== kind) return false
      if (cat !== 'all' && !categoriesForProject(p).includes(cat)) return false
      if (tech && !projectMatchesTech(p, tech)) return false
      if (query) {
        const q = query.toLowerCase()
        const hay = `${p.title} ${p.summary} ${p.description} ${p.stack.join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [cat, kind, tech, query])

  const updateCat = (c: CatFilter) => {
    setCat(c)
    if (c === 'all') params.delete('category')
    else params.set('category', c)
    setParams(params, { replace: true })
  }

  return (
    <>
      <SEO
        title="Projects | Patrick Fanella"
        description="Browse projects, case studies, and tools — by category, stack, and status."
      />
      <div className="container-page py-10 lg:py-14">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">
            Archive
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">All projects</h1>
          <p className="mt-3 text-[color:var(--color-fg-muted)]">
            The full archive — projects, tools, experiments. Filter, search, and switch between gallery, directory, and table modes.
          </p>
        </header>

        {/* Controls */}
        <div className="mt-8 space-y-4">
          {/* search + view */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, stack, descriptions…"
              className="flex-1 min-w-[220px] rounded-md bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border-strong)] px-3 py-2 text-sm placeholder:text-[color:var(--color-fg-dim)] focus:border-[color:var(--color-accent)]"
              aria-label="Search projects"
            />
            <div role="tablist" aria-label="View mode" className="flex items-center gap-1 p-1 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-elev)]">
              {(['gallery', 'directory', 'table'] as const).map((v) => (
                <button
                  key={v}
                  role="tab"
                  aria-selected={view === v}
                  onClick={() => setView(v)}
                  className={`text-xs px-3 py-1.5 rounded transition-colors capitalize ${
                    view === v
                      ? 'bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)]'
                      : 'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <FilterRow label="Type" options={[
            { id: 'all' as KindFilter, label: 'All' },
            { id: 'case-study', label: 'Case studies' },
            { id: 'tool', label: 'Tools' },
          ]} value={kind} onChange={setKind} />

          <FilterRow label="Category" options={[
            { id: 'all' as CatFilter, label: 'All' },
            ...categories.map((c) => ({ id: c.id as CatFilter, label: c.label })),
          ]} value={cat} onChange={updateCat} />

          <FilterRow label="Stack" options={[
            { id: null as string | null, label: 'Any' },
            ...techFilters.map((t) => ({ id: t as string | null, label: t })),
          ]} value={tech} onChange={setTech} />
        </div>

        <p className="mt-6 text-xs text-[color:var(--color-fg-dim)] font-mono">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </p>

        {/* Views */}
        <div className="mt-4">
          {view === 'gallery' && <GalleryView projects={filtered} />}
          {view === 'directory' && <DirectoryView projects={filtered} />}
          {view === 'table' && <TableView projects={filtered} />}
        </div>
      </div>
    </>
  )
}

function GalleryView({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState />
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {projects.map((p, i) => <ProjectCard key={p.slug} project={p} index={i} />)}
    </div>
  )
}

function DirectoryView({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState />
  return (
    <ul className="surface divide-y divide-[color:var(--color-border)]">
      {projects.map((p) => (
        <li key={p.slug}>
          <Link to={`/projects/${p.slug}`} className="flex items-center gap-4 p-4 hover:bg-[color:var(--color-bg-elev-2)] transition-colors">
            <span className="block h-12 w-20 shrink-0 rounded-md overflow-hidden bg-[color:var(--color-bg-elev-2)] border border-[color:var(--color-border)]">
              <img src={p.media[0]?.src ?? '/assets/projects/project-fallback.svg'} alt="" className="h-full w-full object-cover" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">
                <span>{typeLabel(p)}</span>
                <span aria-hidden>·</span>
                <span>{p.year}</span>
                {p.liveUrl && <><span aria-hidden>·</span><span className="text-[color:var(--color-success)]">Live</span></>}
              </div>
              <div className="mt-0.5 flex items-center gap-3">
                <h3 className="text-base font-semibold truncate">{p.title}</h3>
                <span className="text-xs text-[color:var(--color-fg-dim)] hidden md:inline truncate">{p.stack.slice(0,4).join(' · ')}</span>
              </div>
              <p className="mt-1 text-sm text-[color:var(--color-fg-muted)] truncate">{p.summary}</p>
            </div>
            <span className="text-[color:var(--color-fg-dim)] text-sm shrink-0">→</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function TableView({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState />
  return (
    <div className="surface overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-wider text-[color:var(--color-fg-dim)] font-mono">
          <tr className="border-b border-[color:var(--color-border)]">
            <th className="text-left p-3 font-normal">Project</th>
            <th className="text-left p-3 font-normal">Type</th>
            <th className="text-left p-3 font-normal">Year</th>
            <th className="text-left p-3 font-normal">Stack</th>
            <th className="text-left p-3 font-normal">Status</th>
            <th className="text-left p-3 font-normal">Links</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.slug} className="border-b border-[color:var(--color-border)]/60 hover:bg-[color:var(--color-bg-elev-2)] transition-colors">
              <td className="p-3 font-medium">
                <Link to={`/projects/${p.slug}`} className="hover:text-[color:var(--color-accent-soft)]">{p.title}</Link>
              </td>
              <td className="p-3 text-[color:var(--color-fg-muted)]">{typeLabel(p)}</td>
              <td className="p-3 text-[color:var(--color-fg-muted)] font-mono text-xs">{p.year}</td>
              <td className="p-3 text-[color:var(--color-fg-muted)] text-xs">{p.stack.slice(0, 5).join(', ')}</td>
              <td className="p-3 text-xs">
                <span className="font-mono text-[color:var(--color-fg-dim)]">{statusBadges(p).join(' · ')}</span>
              </td>
              <td className="p-3 text-xs space-x-3">
                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-[color:var(--color-accent-soft)] hover:underline">Live</a>}
                {p.repoUrl && <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-[color:var(--color-accent-soft)] hover:underline">Repo</a>}
                <Link to={`/projects/${p.slug}`} className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]">Detail</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="surface p-12 text-center text-[color:var(--color-fg-muted)]">No projects match those filters.</div>
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
      <span className="text-[11px] uppercase tracking-wider text-[color:var(--color-fg-dim)] font-mono mr-2">{label}</span>
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

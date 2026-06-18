import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { ProjectCard } from '../components/ProjectCard'
import { WorkMediaPlaceholder } from '../components/WorkMediaPlaceholder'
import { assetsFor } from '../data/project-assets'
import {
  allProjectsSorted,
  archiveViewModes,
  careerThemes,
  primaryThemeForProject,
  projectKindFilters,
  projectMatchesQuery,
  projectMatchesStack,
  themeLabel,
  themesForProject,
} from '../data/portfolio'
import type { CareerThemeId, Project } from '../lib/types'
import { statusBadges, typeLabel } from '../lib/project-utils'

type ViewMode = 'gallery' | 'directory'
type KindFilter = 'all' | 'case-study' | 'tool'
type SortMode = 'featured' | 'recent' | 'title'

const stackFilters = [
  { id: 'go', label: 'Go' },
  { id: 'react', label: 'React' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'postgresql', label: 'PostgreSQL' },
  { id: 'docker', label: 'Docker' },
  { id: 'llms', label: 'LLMs' },
]

function parseThemeParam(params: URLSearchParams) {
  const repeated = params.getAll('category')
  if (repeated.length > 0) return repeated.filter(Boolean) as CareerThemeId[]

  const single = params.get('category')
  return single ? (single.split(',').map((value) => value.trim()).filter(Boolean) as CareerThemeId[]) : []
}

export function ProjectsPage() {
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState<SortMode>('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const kind = ((params.get('kind') as KindFilter) || 'all') as KindFilter
  const view = ((params.get('view') as ViewMode) || 'gallery') as ViewMode
  const query = params.get('q') ?? ''
  const selectedThemes = parseThemeParam(params)
  const stack = (params.get('stack') ?? '').toLowerCase()

  const filtered = useMemo(() => {
    const list = allProjectsSorted.filter((project) => {
      if (kind !== 'all' && project.kind !== kind) return false
      if (selectedThemes.length > 0 && !selectedThemes.some((theme) => themesForProject(project).includes(theme))) return false
      if (stack && !projectMatchesStack(project, stack)) return false
      if (!projectMatchesQuery(project, query)) return false
      return true
    })

    return [...list].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'recent') return b.year - a.year || a.sortOrder - b.sortOrder
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      if (b.year !== a.year) return b.year - a.year
      return a.sortOrder - b.sortOrder
    })
  }, [kind, query, selectedThemes, sort, stack])

  const themeCountMap = useMemo(() => {
    return careerThemes.reduce((acc, theme) => {
      acc[theme.id] = filtered.filter((project) => themesForProject(project).includes(theme.id)).length
      return acc
    }, {} as Record<CareerThemeId, number>)
  }, [filtered])

  const stackCountMap = useMemo(() => {
    return stackFilters.reduce((acc, option) => {
      acc[option.id] = filtered.filter((project) => projectMatchesStack(project, option.id)).length
      return acc
    }, {} as Record<string, number>)
  }, [filtered])

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const updateCategories = (nextThemes: CareerThemeId[]) => {
    const next = new URLSearchParams(params)
    next.delete('category')
    nextThemes.forEach((theme) => next.append('category', theme))
    setParams(next, { replace: true })
  }

  const resetFilters = () => {
    setSort('featured')
    setFiltersOpen(false)
    setParams(new URLSearchParams(), { replace: true })
  }

  return (
    <>
      <SEO
        title="Projects | Patrick Fanella"
        description="Browse projects and tools by job-search-friendly categories, stack, and mode."
      />

      <div className="container-page py-10 lg:py-14">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Projects</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">Projects + tools, one archive.</h1>
            <p className="mt-3 max-w-2xl text-[color:var(--color-fg-muted)] leading-relaxed">
              Filter by career framing first — Backend Engineering, AI / ML Integration, DevOps & Infra, Developer Tooling — then drill into the stack only when it helps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {projectKindFilters.map((option) => {
              const active = kind === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    const next = option.id as KindFilter
                    updateParam('kind', next === 'all' ? null : next)
                  }}
                  aria-pressed={active}
                  className={`chip transition-colors ${active ? 'chip-active' : 'hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)]'}`}
                >
                  {option.label}
                </button>
              )
            })}

            <div className="ml-2 flex items-center gap-1 rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] p-1">
              {archiveViewModes.map((option) => {
                const active = view === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      const next = option.id as ViewMode
                      updateParam('view', next)
                    }}
                    aria-pressed={active}
                    className={`rounded-full px-3 py-1.5 text-xs transition-colors ${active ? 'bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)]' : 'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]'}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </header>

        <div className="mt-8 lg:grid lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-6">
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="lg:hidden mb-3 flex justify-end">
              <button type="button" onClick={() => setFiltersOpen((value) => !value)} className="btn-secondary text-sm">
                {filtersOpen ? 'Hide filters' : 'Show filters'}
              </button>
            </div>

            <div className={`${filtersOpen ? 'block' : 'hidden'} lg:block panel p-5 space-y-5`}>
              <div>
                <label htmlFor="archive-search" className="block text-[11px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
                  Search
                </label>
                <input
                  id="archive-search"
                  type="search"
                  value={query}
                  onChange={(event) => {
                    const next = event.target.value
                    updateParam('q', next || null)
                  }}
                  placeholder="Title, summary, stack, role…"
                  className="control mt-2"
                />
              </div>

              <FilterBlock
                title="Career themes"
                subtitle="Filter by job-search framing."
                counts={themeCountMap}
                options={careerThemes}
                selected={selectedThemes}
                onToggle={(themeId) => {
                  const next = selectedThemes.includes(themeId)
                    ? selectedThemes.filter((value) => value !== themeId)
                    : [...selectedThemes, themeId]
                  updateCategories(next)
                }}
              />

              <FilterBlock
                title="Stack signal"
                subtitle="One quick tech lens at a time."
                counts={stackCountMap}
                options={stackFilters.map((option) => ({ id: option.id, label: option.label, description: '' }))}
                selected={stack ? [stack] : []}
                onToggle={(value) => {
                  const next = stack === value ? '' : value.toLowerCase()
                  updateParam('stack', next || null)
                }}
              />

              <div>
                <label htmlFor="sort-mode" className="block text-[11px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
                  Sort
                </label>
                <select
                  id="sort-mode"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortMode)}
                  className="control mt-2"
                >
                  <option value="featured">Featured first</option>
                  <option value="recent">Most recent</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-xs text-[color:var(--color-fg-dim)] font-mono">
                  {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
                </p>
                <button type="button" onClick={resetFilters} className="text-xs text-[color:var(--color-accent-soft)] hover:underline">
                  Reset all
                </button>
              </div>
            </div>
          </aside>

          <main className="mt-6 lg:mt-0 min-w-0">
            {view === 'gallery' ? <GalleryView projects={filtered} /> : <DirectoryView projects={filtered} />}
          </main>
        </div>
      </div>
    </>
  )
}

function GalleryView({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState />

  return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}</div>
}

function DirectoryView({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return <EmptyState />

  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const themes = themesForProject(project).slice(0, 3).map((themeId) => themeLabel(themeId))
        const assets = assetsFor(project.slug)
        return (
          <Link
            key={project.slug}
            to={`/projects/${project.slug}`}
            className="panel block p-4 hover:border-[color:var(--color-border-strong)] transition-colors"
          >
            <div className="grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)_260px] lg:items-center">
              <WorkMediaPlaceholder
                title={project.title}
                kicker={project.kind === 'tool' ? 'Tool' : 'Project'}
                summary={project.summary}
                caption={`${themeLabel(primaryThemeForProject(project))} · ${project.year}`}
                accent={project.kind === 'tool' ? 'amber' : project.featured ? 'violet' : 'green'}
                variant="square"
                className="h-full"
                src={assets.thumbDirectory ?? assets.thumbSquare ?? assets.hero}
              />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
                  <span>{typeLabel(project)}</span>
                  <span aria-hidden>·</span>
                  <span>{project.year}</span>
                  {project.liveUrl && (
                    <>
                      <span aria-hidden>·</span>
                      <span className="text-[color:var(--color-success)]">Live</span>
                    </>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-3">
                  <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
                  <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed line-clamp-2">{project.summary}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {themes.map((theme) => (
                    <span key={theme} className="chip text-[11px]">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 text-xs text-[color:var(--color-fg-muted)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">Stack</span>
                  <span>{project.stack.slice(0, 4).join(' · ')}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">Status</span>
                  <span className="font-mono">{statusBadges(project).join(' · ') || '—'}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">Role</span>
                  <span>{project.role}</span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function EmptyState() {
  return <div className="panel p-12 text-center text-[color:var(--color-fg-muted)]">No work matches those filters.</div>
}

interface FilterBlockProps<T extends { id: string; label: string; description: string }> {
  title: string
  subtitle: string
  options: T[]
  selected: string[]
  onToggle: (id: T['id']) => void
  counts?: Record<string, number>
}

function FilterBlock<T extends { id: string; label: string; description: string }>({ title, subtitle, options, selected, onToggle, counts }: FilterBlockProps<T>) {
  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[11px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">{title}</h2>
          <p className="mt-1 text-xs text-[color:var(--color-fg-muted)]">{subtitle}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option.id)
          const count = counts?.[option.id]
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(option.id)}
              className={`chip text-left transition-colors ${active ? 'chip-active' : 'hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg)]'}`}
            >
              <span>{option.label}</span>
              {typeof count === 'number' && <span className="text-[10px] opacity-80">{count}</span>}
            </button>
          )
        })}
      </div>
    </section>
  )
}

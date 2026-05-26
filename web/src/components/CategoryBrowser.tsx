import { Link } from 'react-router-dom'
import { categories, projects, categoriesForProject } from '../data/portfolio'
import type { CategoryId } from '../lib/types'

export function CategoryBrowser() {
  const counts: Record<CategoryId, number> = categories.reduce(
    (acc, c) => ({ ...acc, [c.id]: 0 }),
    {} as Record<CategoryId, number>,
  )
  const examples: Record<CategoryId, string[]> = categories.reduce(
    (acc, c) => ({ ...acc, [c.id]: [] }),
    {} as Record<CategoryId, string[]>,
  )
  for (const p of projects) {
    for (const id of categoriesForProject(p)) {
      counts[id]++
      if (examples[id].length < 3) examples[id].push(p.title)
    }
  }

  return (
    <section aria-labelledby="categories-heading" className="container-page py-16 lg:py-20 border-t border-[color:var(--color-border)]/60">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Browse by domain</p>
        <h2 id="categories-heading" className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Categories</h2>
        <p className="mt-3 text-[color:var(--color-fg-muted)]">
          Explore the work the way you think about it — by problem domain rather than by tag list.
        </p>
      </header>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/projects?category=${c.id}`}
            className="group surface p-6 hover:bg-[color:var(--color-bg-elev-2)] hover:border-[color:var(--color-border-strong)] transition-colors"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-base font-semibold tracking-tight">{c.label}</h3>
              <span className="text-xs font-mono text-[color:var(--color-fg-dim)]">{counts[c.id]}</span>
            </div>
            <p className="mt-2 text-sm text-[color:var(--color-fg-muted)] leading-relaxed">{c.description}</p>
            {examples[c.id].length > 0 && (
              <p className="mt-3 text-xs text-[color:var(--color-fg-dim)]">
                e.g. {examples[c.id].join(', ')}
              </p>
            )}
            <span className="mt-4 inline-block text-xs text-[color:var(--color-accent-soft)] group-hover:translate-x-0.5 transition-transform">
              Browse →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

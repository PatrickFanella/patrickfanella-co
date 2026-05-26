import { Link } from 'react-router-dom'
import { toolProjects } from '../data/portfolio'

export function ToolsStrip() {
  const items = toolProjects.slice(0, 6)
  if (items.length === 0) return null
  return (
    <section aria-labelledby="tools-strip-heading" className="container-page py-16 lg:py-20 border-t border-[color:var(--color-border)]/60">
      <header className="flex flex-wrap items-end justify-between gap-4 max-w-3xl">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Smaller utilities</p>
          <h2 id="tools-strip-heading" className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Developer tools</h2>
          <p className="mt-3 text-[color:var(--color-fg-muted)]">CLI tools, plugins, MCP servers, and infra utilities.</p>
        </div>
        <Link to="/tools" className="text-sm text-[color:var(--color-accent-soft)] hover:underline">All tools →</Link>
      </header>
      <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((t) => (
          <li key={t.slug}>
            <Link
              to={`/projects/${t.slug}`}
              className="block surface p-4 hover:bg-[color:var(--color-bg-elev-2)] hover:border-[color:var(--color-border-strong)] transition-colors"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-warning)]">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-warning)]" />
                Tool
              </div>
              <h3 className="mt-2 text-base font-semibold">{t.title}</h3>
              <p className="mt-1 text-xs text-[color:var(--color-fg-muted)] line-clamp-2">{t.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { toolProjects } from '../data/portfolio'
import { statusBadges } from '../lib/project-utils'

export function ToolsPage() {
  return (
    <>
      <SEO
        title="Tools | Patrick Fanella"
        description="CLI tools, plugins, MCP servers, and infra utilities."
      />
      <div className="container-page py-10 lg:py-14">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Utilities</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Tools</h1>
          <p className="mt-3 text-[color:var(--color-fg-muted)]">
            Small utilities: CLIs, plugins, MCP servers, and infra helpers. Evaluated differently from full products — these are sharp, focused pieces.
          </p>
        </header>

        {toolProjects.length === 0 ? (
          <div className="mt-12 surface p-12 text-center text-[color:var(--color-fg-muted)]">
            No public tools yet.
          </div>
        ) : (
          <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {toolProjects.map((t) => (
              <li key={t.slug}>
                <Link
                  to={`/projects/${t.slug}`}
                  className="block surface p-5 hover:bg-[color:var(--color-bg-elev-2)] hover:border-[color:var(--color-border-strong)] transition-colors h-full"
                >
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-warning)]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-warning)]" />
                    Tool · {t.year}
                  </div>
                  <h2 className="mt-2 text-lg font-semibold">{t.title}</h2>
                  <p className="mt-1 text-sm text-[color:var(--color-fg-muted)] leading-relaxed line-clamp-3">{t.summary}</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {t.stack.slice(0, 4).map((s) => (
                      <li key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[color:var(--color-bg-elev-2)] text-[color:var(--color-fg-muted)] border border-[color:var(--color-border)]">{s}</li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-3 border-t border-[color:var(--color-border)]/60 flex items-center gap-3 text-xs">
                    <span className="text-[color:var(--color-accent-soft)]">Details →</span>
                    {t.repoUrl && <a href={t.repoUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]">Repo ↗</a>}
                    <span className="ml-auto text-[10px] font-mono text-[color:var(--color-fg-dim)]">{statusBadges(t).join(' · ')}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}

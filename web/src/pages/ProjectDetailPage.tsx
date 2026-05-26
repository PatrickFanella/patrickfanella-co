import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../components/SEO'
import { projectsBySlug, allProjectsSorted } from '../data/portfolio'
import { statusBadges, typeLabel } from '../lib/project-utils'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const project = projectsBySlug[slug]
  const reduced = usePrefersReducedMotion()

  if (!project) {
    return (
      <div className="container-page py-24 text-center">
        <SEO title="Project not found | Patrick Fanella" />
        <p className="text-sm uppercase tracking-wider text-[color:var(--color-fg-dim)] font-mono">404</p>
        <h1 className="mt-3 text-3xl font-semibold">Project not found</h1>
        <p className="mt-3 text-[color:var(--color-fg-muted)]">That project doesn't exist or has moved.</p>
        <Link to="/projects" className="mt-6 inline-block text-[color:var(--color-accent-soft)] hover:underline">← Back to projects</Link>
      </div>
    )
  }

  const heroMedia = project.media[0]
  const gallery = project.media.slice(1)
  const badges = statusBadges(project)

  // related: same category-ish (share stack tokens), exclude self
  const related = allProjectsSorted
    .filter((p) => p.slug !== project.slug)
    .filter((p) => p.stack.some((s) => project.stack.includes(s)))
    .slice(0, 3)

  return (
    <>
      <SEO title={`${project.title} | Patrick Fanella`} description={project.summary} />
      <article className="container-page py-10 lg:py-14">
        <Link to="/projects" className="inline-flex items-center gap-1 text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]">
          <span aria-hidden>←</span> All projects
        </Link>

        <header className="mt-6 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-start">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.99, y: 8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.5 }}
            className="aspect-[16/10] rounded-2xl overflow-hidden surface-2"
          >
            <img
              src={heroMedia?.src ?? '/assets/projects/project-fallback.svg'}
              alt={heroMedia?.alt ?? `${project.title} hero`}
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">
              <span>{typeLabel(project)}</span>
              <span aria-hidden>·</span>
              <span>{project.year}</span>
              <span aria-hidden>·</span>
              <span>{project.role}</span>
            </div>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]">{project.title}</h1>
            <p className="mt-4 text-lg text-[color:var(--color-fg-muted)] leading-relaxed">{project.summary}</p>

            {badges.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {badges.map((b) => (
                  <span key={b} className="text-[11px] font-mono uppercase tracking-wider px-2 py-1 rounded-md border border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-fg-muted)]">{b}</span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="rounded-md bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] font-medium px-4 py-2.5 text-sm hover:bg-[color:var(--color-accent-soft)] transition-colors">
                  Live Demo ↗
                </a>
              )}
              {project.repoUrl && (
                <a href={project.repoUrl} target="_blank" rel="noreferrer" className="rounded-md border border-[color:var(--color-border-strong)] px-4 py-2.5 text-sm hover:bg-[color:var(--color-bg-elev)] transition-colors">
                  GitHub ↗
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="mt-14 grid lg:grid-cols-[1fr_280px] gap-12">
          <div className="space-y-12 min-w-0">
            <Section title="Overview">
              <p className="text-[color:var(--color-fg)]/90 leading-relaxed whitespace-pre-line">{project.description}</p>
            </Section>

            {project.highlights.length > 0 && (
              <Section title="Proof points">
                <ul className="space-y-3">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3 text-[color:var(--color-fg)]/90">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {project.architecture && project.architecture.length > 0 && (
              <Section title="Architecture & technical notes">
                <ul className="space-y-3">
                  {project.architecture.map((a, i) => (
                    <li key={i} className="flex gap-3 text-[color:var(--color-fg)]/90">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent-soft)] shrink-0" />
                      <span className="leading-relaxed">{a}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {project.lessons && project.lessons.length > 0 && (
              <Section title="What I learned">
                <ul className="space-y-3">
                  {project.lessons.map((l, i) => (
                    <li key={i} className="flex gap-3 text-[color:var(--color-fg)]/90">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-success)] shrink-0" />
                      <span className="leading-relaxed">{l}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {gallery.length > 0 && (
              <Section title="Gallery">
                <div className="grid sm:grid-cols-2 gap-4">
                  {gallery.map((m, i) => (
                    <figure key={i} className="surface overflow-hidden">
                      <img src={m.src} alt={m.alt} className="w-full h-auto" loading="lazy" />
                      {m.caption && (
                        <figcaption className="p-3 text-xs text-[color:var(--color-fg-muted)] border-t border-[color:var(--color-border)]">
                          {m.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </Section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="surface p-5">
              <h3 className="text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">Role</h3>
              <p className="mt-2 text-sm">{project.role}</p>
            </div>
            <div className="surface p-5">
              <h3 className="text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">Stack</h3>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="text-[11px] font-mono px-2 py-1 rounded bg-[color:var(--color-bg-elev-2)] text-[color:var(--color-fg-muted)] border border-[color:var(--color-border)]">{s}</li>
                ))}
              </ul>
            </div>
            <div className="surface p-5">
              <h3 className="text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">Year</h3>
              <p className="mt-2 text-sm font-mono">{project.year}</p>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20 pt-10 border-t border-[color:var(--color-border)]">
            <h2 className="text-2xl font-semibold tracking-tight">Related work</h2>
            <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link to={`/projects/${p.slug}`} className="block surface p-5 hover:bg-[color:var(--color-bg-elev-2)] hover:border-[color:var(--color-border-strong)] transition-colors">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">{typeLabel(p)} · {p.year}</div>
                    <h3 className="mt-1 text-base font-semibold">{p.title}</h3>
                    <p className="mt-1 text-xs text-[color:var(--color-fg-muted)] line-clamp-2">{p.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

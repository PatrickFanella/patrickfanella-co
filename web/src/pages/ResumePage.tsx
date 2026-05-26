import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { featuredProjects, allProjectsSorted } from '../data/portfolio'

const summary =
  'Full-stack engineer who ships production systems end-to-end. Comfortable across Go backends, TypeScript frontends, PostgreSQL, search infrastructure, LLM pipelines, and self-hosted infrastructure. Focused on shipping, observability, and clean contracts between systems.'

const skillGroups: { label: string; items: string[] }[] = [
  { label: 'Backend', items: ['Go (Gin, net/http)', 'PostgreSQL 17', 'Redis', 'OpenSearch / hybrid search', 'gRPC / REST', 'Auth & sessions'] },
  { label: 'Frontend', items: ['React 19 / TypeScript', 'Next.js', 'React Native / Expo', 'Tailwind CSS', 'Vite', 'Framer Motion'] },
  { label: 'AI & data', items: ['LLM orchestration', 'Agent systems', 'Evaluation pipelines', 'Embeddings & vector search', 'Transcription & content pipelines'] },
  { label: 'Infrastructure', items: ['Docker / Compose', 'Kubernetes', 'Caddy', 'GitHub Actions CI/CD', 'Prometheus / Grafana', 'Self-hosted Gitea & ops'] },
]

const experience = [
  {
    role: 'Independent full-stack engineer',
    org: 'PatrickFanella.co · self-directed product work',
    period: '2022 — present',
    points: [
      'Designed and shipped Clpr, a production Twitch clip platform: Go API, React web, React Native mobile, hybrid BM25 + semantic vector search, deployed on Kubernetes.',
      'Built Subcorp, a multi-agent operations layer where autonomous agents coordinate, debate, and execute missions against a shared memory store.',
      'Maintained homelab and self-hosted ops: Caddy edge, Authelia, wg-easy, Tdarr / Immich media, SnapRAID + MergerFS storage, Borgmatic backups.',
    ],
  },
]

export function ResumePage() {
  const selected = featuredProjects.length > 0 ? featuredProjects : allProjectsSorted.slice(0, 5)

  return (
    <>
      <SEO
        title="Resume | Patrick Fanella"
        description="Resume: full-stack engineer specializing in Go, React, PostgreSQL, AI systems, and production infrastructure."
      />
      <div className="container-page py-10 lg:py-14">
        <header className="flex flex-wrap items-end justify-between gap-6 max-w-4xl">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Resume</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Patrick Fanella</h1>
            <p className="mt-2 text-[color:var(--color-fg-muted)]">Full-stack engineer · Go · React · PostgreSQL · AI systems</p>
          </div>
          <a
            href="/patrick_fanella_resume.pdf"
            download
            className="rounded-md bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] font-medium px-4 py-2.5 text-sm hover:bg-[color:var(--color-accent-soft)] transition-colors"
          >
            Download PDF ↓
          </a>
        </header>

        <section className="mt-10 surface p-6 md:p-8 max-w-4xl">
          <h2 className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Summary</h2>
          <p className="mt-3 text-[color:var(--color-fg)]/90 leading-relaxed">{summary}</p>
        </section>

        <section className="mt-10 max-w-4xl">
          <h2 className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Skills</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            {skillGroups.map((g) => (
              <div key={g.label} className="surface p-5">
                <h3 className="text-sm font-semibold">{g.label}</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {g.items.map((i) => (
                    <li key={i} className="text-[11px] font-mono px-2 py-1 rounded bg-[color:var(--color-bg-elev-2)] text-[color:var(--color-fg-muted)] border border-[color:var(--color-border)]">{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 max-w-4xl">
          <h2 className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Experience</h2>
          <ol className="mt-4 space-y-5">
            {experience.map((e, i) => (
              <li key={i} className="surface p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold">{e.role}</h3>
                  <span className="text-xs font-mono text-[color:var(--color-fg-dim)]">{e.period}</span>
                </div>
                <p className="mt-0.5 text-sm text-[color:var(--color-fg-muted)]">{e.org}</p>
                <ul className="mt-3 space-y-2">
                  {e.points.map((p, j) => (
                    <li key={j} className="flex gap-3 text-sm text-[color:var(--color-fg)]/90">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0" />
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 max-w-4xl">
          <h2 className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Selected projects</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-4">
            {selected.map((p) => (
              <li key={p.slug}>
                <Link to={`/projects/${p.slug}`} className="block surface p-5 hover:bg-[color:var(--color-bg-elev-2)] hover:border-[color:var(--color-border-strong)] transition-colors">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">
                    <span>{p.kind === 'tool' ? 'Tool' : 'Case study'}</span>
                    <span>{p.year}</span>
                  </div>
                  <h3 className="mt-1 text-base font-semibold">{p.title}</h3>
                  <p className="mt-1 text-xs text-[color:var(--color-fg-muted)] line-clamp-2">{p.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

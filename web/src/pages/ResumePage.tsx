import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { allProjectsSorted, featuredProjects, themeLabel, themesForProject } from '../data/portfolio'
import type { CareerThemeId } from '../lib/types'

type LayoutMode = 'infographic' | 'traditional'

const bio =
  'Full-stack engineer shipping production systems end-to-end: backend APIs, React frontends, AI workflows, data pipelines, and self-hosted infrastructure. I like fast feedback loops, clear contracts, and work that stays operable after launch.'

const skillGroups: { label: string; items: { label: string; href: string }[] }[] = [
  {
    label: 'Backend',
    items: [
      { label: 'Go / net/http', href: '/projects?stack=go' },
      { label: 'PostgreSQL', href: '/projects?stack=postgresql' },
      { label: 'Redis', href: '/projects?stack=redis' },
      { label: 'OpenSearch', href: '/projects?stack=opensearch' },
      { label: 'Auth & sessions', href: '/projects?category=security-identity' },
      { label: 'Worker queues', href: '/projects?category=backend-engineering' },
    ],
  },
  {
    label: 'Frontend',
    items: [
      { label: 'React 19', href: '/projects?stack=react' },
      { label: 'TypeScript', href: '/projects?stack=typescript' },
      { label: 'Vite', href: '/projects?stack=vite' },
      { label: 'Next.js', href: '/projects?stack=next.js' },
      { label: 'Tailwind CSS', href: '/projects?stack=tailwind' },
      { label: 'Framer Motion', href: '/projects?stack=framer-motion' },
    ],
  },
  {
    label: 'AI & data',
    items: [
      { label: 'LLM orchestration', href: '/projects?category=ai-ml-integration' },
      { label: 'Agent systems', href: '/projects?category=ai-ml-integration' },
      { label: 'Transcription', href: '/projects?stack=transcription' },
      { label: 'Embeddings', href: '/projects?stack=embeddings' },
      { label: 'Evaluation', href: '/projects?stack=evaluation' },
      { label: 'Search pipelines', href: '/projects?category=data-pipelines' },
    ],
  },
  {
    label: 'Infrastructure',
    items: [
      { label: 'Docker', href: '/projects?stack=docker' },
      { label: 'Kubernetes', href: '/projects?stack=kubernetes' },
      { label: 'GitHub Actions', href: '/projects?stack=github-actions' },
      { label: 'Observability', href: '/projects?category=devops-infra' },
      { label: 'Self-hosting', href: '/projects?category=devops-infra' },
      { label: 'Deploy automation', href: '/projects?category=devops-infra' },
    ],
  },
]

const experience = [
  {
    role: 'Independent full-stack engineer',
    org: 'PatrickFanella.co · self-directed product work',
    period: '2022 — present',
    focus: [
      { label: 'Full-Stack Apps', href: '/projects?category=full-stack-apps' },
      { label: 'DevOps & Infra', href: '/projects?category=devops-infra' },
      { label: 'Developer Tooling', href: '/projects?category=developer-tooling' },
    ],
    points: [
      'Designed and shipped Clpr, a production Twitch clip platform with a Go API, React web client, React Native mobile app, hybrid search, and Kubernetes deployment.',
      'Built Subcorp, a multi-agent coordination platform where autonomous agents debate, plan, and execute work through a shared memory and tool layer.',
      'Kept the portfolio and companion systems operational with deployment docs, migrations, observability, and self-hosted infra patterns that survive handoff.',
    ],
  },
]

export function ResumePage() {
  const selected = featuredProjects.length > 0 ? featuredProjects : allProjectsSorted.slice(0, 5)
  const [params, setParams] = useSearchParams()
  const layout = (params.get('layout') === 'traditional' ? 'traditional' : 'infographic') as LayoutMode

  const uniqueThemes = useMemo<CareerThemeId[]>(() => {
    return Array.from(new Set(selected.flatMap((project) => themesForProject(project)))).slice(0, 8) as CareerThemeId[]
  }, [selected])

  return (
    <>
      <SEO
        title="Resume | Patrick Fanella"
        description="One-page resume for a full-stack engineer specializing in Go, React, AI systems, and production infrastructure."
      />

      <div className="container-page py-10 lg:py-14">
        <header className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="section-kicker">Resume</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">Patrick Fanella</h1>
            <p className="mt-2 text-[color:var(--color-fg-muted)]">Full-stack engineer · Go · React · AI systems · Infrastructure</p>
            <p className="mt-5 max-w-3xl text-[color:var(--color-fg)]/92 leading-relaxed">{bio}</p>
          </div>

          <div className="panel p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">Layout</div>
              <ResumeToggle
                value={layout}
                onChange={(next) => {
                  setParams(buildLayoutParams(params, next), { replace: true })
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Fact label="Focus" value="Shipped systems" />
              <Fact label="Mode" value="Full-stack + infra" />
              <Fact label="Strength" value="Fast feedback" />
              <Fact label="Availability" value="Selective" />
            </div>
            <a href="/patrick_fanella_resume.pdf" download className="btn-primary w-full mt-1">
              Download PDF
              <span aria-hidden>↓</span>
            </a>
          </div>
        </header>

        {layout === 'infographic' ? (
          <InfographicResume selected={selected} selectedThemes={uniqueThemes} />
        ) : (
          <TraditionalResume selected={selected} selectedThemes={uniqueThemes} />
        )}
      </div>
    </>
  )
}

function InfographicResume({ selected, selectedThemes }: { selected: typeof allProjectsSorted; selectedThemes: CareerThemeId[] }) {
  return (
    <>
      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="panel p-6 space-y-4">
          <h2 className="section-kicker">Bio</h2>
          <p className="text-[color:var(--color-fg)]/92 leading-relaxed">{bio}</p>
        </div>
        <div className="panel p-6 space-y-4">
          <h2 className="section-kicker">Core themes</h2>
          <div className="flex flex-wrap gap-2">
            {selectedThemes.map((themeId) => (
              <Link key={themeId} to={`/projects?category=${themeId}`} className="chip text-[11px] hover:text-[color:var(--color-fg)]">
                {themeLabel(themeId)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-kicker">Skills</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.label} className="panel p-5">
              <h3 className="text-base font-semibold">{group.label}</h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.href} className="chip text-[11px] hover:text-[color:var(--color-fg)]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-kicker">Experience</h2>
        <ol className="mt-4 space-y-4">
          {experience.map((entry) => (
            <li key={entry.role} className="panel p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{entry.role}</h3>
                <span className="text-xs font-mono text-[color:var(--color-fg-dim)]">{entry.period}</span>
              </div>
              <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">{entry.org}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.focus.map((focus) => (
                  <Link key={focus.label} to={focus.href} className="chip text-[11px] hover:text-[color:var(--color-fg)]">
                    {focus.label}
                  </Link>
                ))}
              </div>
              <ul className="mt-4 space-y-3">
                {entry.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-[color:var(--color-fg)]/92">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-kicker">Selected projects</h2>
            <p className="mt-2 text-[color:var(--color-fg-muted)]">A short list of the strongest recent work.</p>
          </div>
          <Link to="/projects" className="text-sm text-[color:var(--color-accent-soft)] hover:underline">
            Browse projects →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {selected.map((project) => (
            <Link key={project.slug} to={`/projects/${project.slug}`} className="panel p-5 hover:border-[color:var(--color-border-strong)] transition-colors">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
                <span>{project.kind === 'tool' ? 'Tool' : 'Case study'}</span>
                <span>{project.year}</span>
              </div>
              <h3 className="mt-2 text-base font-semibold">{project.title}</h3>
              <p className="mt-1 text-xs text-[color:var(--color-fg-muted)] line-clamp-2">{project.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {themesForProject(project).slice(0, 2).map((themeId) => (
                  <span key={themeId} className="chip text-[10px]">
                    {themeLabel(themeId)}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

function TraditionalResume({ selected, selectedThemes }: { selected: typeof allProjectsSorted; selectedThemes: CareerThemeId[] }) {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="space-y-4 min-w-0">
        <div className="panel p-6">
          <h2 className="section-kicker">Bio</h2>
          <p className="mt-4 text-[color:var(--color-fg)]/92 leading-relaxed">{bio}</p>
        </div>

        <div className="panel p-6">
          <h2 className="section-kicker">Experience</h2>
          <div className="mt-4 space-y-4">
            {experience.map((entry) => (
              <div key={entry.role} className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/70 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold">{entry.role}</h3>
                  <span className="text-xs font-mono text-[color:var(--color-fg-dim)]">{entry.period}</span>
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-fg-muted)]">{entry.org}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.focus.map((focus) => (
                    <Link key={focus.label} to={focus.href} className="chip text-[11px] hover:text-[color:var(--color-fg)]">
                      {focus.label}
                    </Link>
                  ))}
                </div>
                <ul className="mt-4 space-y-3">
                  {entry.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-[color:var(--color-fg)]/92">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="section-kicker">Selected projects</h2>
              <p className="mt-2 text-[color:var(--color-fg-muted)]">A short list of the strongest recent work.</p>
            </div>
            <Link to="/projects" className="text-sm text-[color:var(--color-accent-soft)] hover:underline">
              Browse projects →
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {selected.map((project) => (
              <Link key={project.slug} to={`/projects/${project.slug}`} className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]/70 p-4 hover:border-[color:var(--color-border-strong)] transition-colors">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
                  <span>{project.kind === 'tool' ? 'Tool' : 'Case study'}</span>
                  <span>{project.year}</span>
                </div>
                <h3 className="mt-2 text-base font-semibold">{project.title}</h3>
                <p className="mt-1 text-xs text-[color:var(--color-fg-muted)] line-clamp-2">{project.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
        <div className="panel p-5">
          <h2 className="section-kicker">Skills</h2>
          <div className="mt-4 space-y-4">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-semibold">{group.label}</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link to={item.href} className="chip text-[10px] hover:text-[color:var(--color-fg)]">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="section-kicker">Core themes</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedThemes.map((themeId) => (
              <Link key={themeId} to={`/projects?category=${themeId}`} className="chip text-[11px] hover:text-[color:var(--color-fg)]">
                {themeLabel(themeId)}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  )
}

function ResumeToggle({ value, onChange }: { value: LayoutMode; onChange: (value: LayoutMode) => void }) {
  return (
    <div className="rounded-full border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface-2)] p-1 flex gap-1">
      {[
        { id: 'infographic', label: 'Infographic' },
        { id: 'traditional', label: 'Traditional' },
      ].map((option) => {
        const active = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.id as LayoutMode)}
            className={`rounded-full px-3 py-1.5 text-xs transition-colors ${active ? 'bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)]' : 'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]'}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

function buildLayoutParams(params: URLSearchParams, layout: LayoutMode) {
  const next = new URLSearchParams(params)
  next.set('layout', layout)
  return next
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">{label}</div>
      <div className="mt-1 text-sm text-[color:var(--color-fg)]">{value}</div>
    </div>
  )
}

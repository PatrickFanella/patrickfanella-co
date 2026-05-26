import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import { devlogPosts } from '../data/devlog'
import { projectsBySlug } from '../data/portfolio'
import type { DevlogPost } from '../lib/types'
import type { ReactNode } from 'react'

const dayFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export function DevlogPage() {
  const sorted = [...devlogPosts].sort((a, b) => b.date.localeCompare(a.date))
  const grouped = sorted.reduce<Record<string, DevlogPost[]>>((acc, post) => {
    acc[post.date] = acc[post.date] ? [...acc[post.date], post] : [post]
    return acc
  }, {})

  return (
    <>
      <SEO
        title="Devlog | Patrick Fanella"
        description="Daily devlog feed from Changemaker ingestion, with tags and project references."
      />

      <div className="container-page py-10 lg:py-14">
        <header className="max-w-3xl">
          <p className="section-kicker">Devlog</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">Daily build notes.</h1>
          <p className="mt-3 text-[color:var(--color-fg-muted)] leading-relaxed">
            A reverse-chronological feed of small updates from Changemaker. Posts are grouped by day, tagged, and linked back to related work when available.
          </p>
        </header>

        <section className="mt-10 space-y-8">
          {Object.entries(grouped).map(([date, posts]) => (
            <div key={date}>
              <h2 className="text-sm uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
                {dayFormatter.format(new Date(`${date}T12:00:00Z`))}
              </h2>
              <div className="mt-4 space-y-4">
                {posts.map((post) => {
                  const related = post.projectRef ? projectsBySlug[post.projectRef] : undefined
                  return (
                    <article key={post.id} className="panel p-5 md:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">
                            <span>{post.source}</span>
                            <span aria-hidden>·</span>
                            <time dateTime={post.date}>{post.date}</time>
                          </div>
                          <h3 className="mt-2 text-2xl font-display font-semibold tracking-tight">{post.title}</h3>
                        </div>
                        {related && (
                          <Link to={`/projects/${related.slug}`} className="chip text-[11px] hover:text-[color:var(--color-fg)]">
                            Related: {related.title}
                          </Link>
                        )}
                      </div>

                      <MarkdownBody body={post.body} />

                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="chip text-[11px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}

function MarkdownBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\s*\n/)

  return (
    <div className="mt-4 space-y-3 text-[color:var(--color-fg)]/92 leading-relaxed">
      {blocks.map((block, index) => {
        const lines = block.split('\n')
        if (lines.every((line) => line.trim().startsWith('- '))) {
          return (
            <ul key={`${index}-${block}`} className="space-y-2">
              {lines.map((line) => (
                <li key={line} className="flex gap-3 text-sm">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shrink-0" />
                  <span>{renderInline(line.replace(/^[-*]\s+/, ''))}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (lines.every((line) => line.trim().startsWith('> '))) {
          return (
            <blockquote key={`${index}-${block}`} className="panel-strong border-l-4 border-[color:var(--color-accent)] p-4">
              <p className="font-display text-lg leading-snug">{renderInline(lines.map((line) => line.replace(/^>\s+/, '')).join(' '))}</p>
            </blockquote>
          )
        }

        return (
          <p key={`${index}-${block}`} className="text-sm md:text-base">
            {renderInline(block)}
          </p>
        )
      })}
    </div>
  )
}

function renderInline(text: string) {
  const parts: ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const [token] = match
    const index = match.index

    if (index > lastIndex) parts.push(text.slice(lastIndex, index))

    if (token.startsWith('**')) {
      parts.push(<strong key={`${index}-${token}`}>{token.slice(2, -2)}</strong>)
    } else {
      const [label, href] = token.slice(1, -1).split('](')
      parts.push(
        <a key={`${index}-${token}`} href={href} className="text-[color:var(--color-accent-soft)] hover:underline">
          {label}
        </a>,
      )
    }

    lastIndex = index + token.length
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

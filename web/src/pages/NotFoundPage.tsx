import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'

export function NotFoundPage() {
  return (
    <>
      <SEO title="Page not found | Patrick Fanella" />
      <div className="container-page py-24 text-center">
        <p className="text-xs uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 text-[color:var(--color-fg-muted)]">That URL doesn't lead anywhere.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="rounded-md bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] font-medium px-4 py-2.5 text-sm hover:bg-[color:var(--color-accent-soft)] transition-colors">Back home</Link>
          <Link to="/projects" className="rounded-md border border-[color:var(--color-border-strong)] px-4 py-2.5 text-sm hover:bg-[color:var(--color-bg-elev)] transition-colors">Browse projects</Link>
        </div>
      </div>
    </>
  )
}

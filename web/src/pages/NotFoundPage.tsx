import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'

export function NotFoundPage() {
  return (
    <>
      <SEO title="Page not found | Patrick Fanella" />
      <div className="container-page py-24 text-center">
        <p className="text-xs uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">404</p>
        <h1 className="mt-3 text-4xl font-display font-semibold tracking-tight">This page isn't here.</h1>
        <p className="mt-3 text-[color:var(--color-fg-muted)]">Try Home or Projects instead.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="btn-primary">Home</Link>
          <Link to="/projects" className="btn-secondary">Projects</Link>
        </div>
      </div>
    </>
  )
}

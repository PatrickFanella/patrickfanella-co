import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-[color:var(--color-border)]/60">
      <div className="container-page py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-[color:var(--color-fg-muted)]">
        <div>
          <div className="font-mono text-[color:var(--color-fg)]">Patrick Fanella</div>
          <div className="mt-1">Full-stack engineer · Go · React · AI systems</div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/projects" className="hover:text-[color:var(--color-fg)]">All projects</Link>
          <Link to="/tools" className="hover:text-[color:var(--color-fg)]">Tools</Link>
          <Link to="/resume" className="hover:text-[color:var(--color-fg)]">Resume</Link>
          <Link to="/contact" className="hover:text-[color:var(--color-fg)]">Contact</Link>
          <a href="https://github.com/PatrickFanella" className="hover:text-[color:var(--color-fg)]" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
        <div className="text-xs text-[color:var(--color-fg-dim)]">© {new Date().getFullYear()}</div>
      </div>
    </footer>
  )
}

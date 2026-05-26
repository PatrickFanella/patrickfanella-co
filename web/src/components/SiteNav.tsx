import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
  { to: '/devlog', label: 'Devlog' },
]

export function SiteNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-[color:var(--color-bg)]/72 border-b border-[color:var(--color-border)]/60">
      <div className="container-page flex items-center justify-between h-14">
        <Link to="/" className="font-display text-sm font-semibold tracking-[0.12em] uppercase text-[color:var(--color-fg)]">
          patrick<span className="text-[color:var(--color-accent)]">.</span>fanella
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full border transition-colors ${
                  isActive
                    ? 'text-[color:var(--color-fg)] bg-[color:var(--color-surface-2)] border-[color:var(--color-border-strong)]'
                    : 'text-[color:var(--color-fg-muted)] border-transparent hover:text-[color:var(--color-fg)] hover:border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-2)]/70'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

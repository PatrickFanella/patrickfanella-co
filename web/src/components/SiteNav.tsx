import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Work' },
  { to: '/projects', label: 'Projects' },
  { to: '/tools', label: 'Tools' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
]

export function SiteNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[color:var(--color-bg)]/70 border-b border-[color:var(--color-border)]/60">
      <div className="container-page flex items-center justify-between h-14">
        <Link to="/" className="font-mono text-sm tracking-tight text-[color:var(--color-fg)]">
          patrick<span className="text-[color:var(--color-accent)]">.</span>fanella
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'text-[color:var(--color-fg)] bg-[color:var(--color-bg-elev)]'
                    : 'text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]'
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

import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

import { monoLabelClass, navButtonClass, textLinkClass } from '../lib/styles'

const navigation = [
  { to: '/projects', label: 'Projects' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
]

const externalLinks = [
  { href: 'mailto:fanella.patrick@gmail.com', label: 'Email' },
  { href: 'https://linkedin.com/in/patrick-fanella', label: 'LinkedIn' },
  { href: 'https://github.com/PatrickFanella', label: 'GitHub' },
  { href: 'https://git.subcult.tv/PatrickFanella', label: 'Gitea' },
]

export function SiteLayout() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }
    window.scrollTo(0, 0)
    mainRef.current?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-paper font-body text-ink selection:bg-accent-green selection:text-paper">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="mx-auto flex min-h-screen max-w-320 flex-col bg-paper">
        <header className="grid gap-4 border-b border-stroke px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center md:px-10 md:py-6">
          <Link className="group grid w-fit gap-1" to="/">
            <span className="font-display text-xl font-semibold tracking-tight text-heading">Patrick Fanella</span>
            <span className="text-sm text-ink-soft">
              Software engineer · Chicago
            </span>
          </Link>
          <nav className="grid grid-cols-3 gap-4" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => [
                  navButtonClass,
                  isActive
                    ? 'border-accent-purple text-heading'
                    : 'border-transparent text-ink-soft hover:border-stroke',
                ].join(' ')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-5 py-6 focus-visible:outline-none md:px-10 md:py-10" id="main-content" ref={mainRef} tabIndex={-1}>
          <Outlet />
        </main>

        <footer className="grid gap-6 border-t border-stroke p-5 text-sm leading-relaxed text-ink-soft md:px-10 md:py-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="grid gap-3">
            <p className="font-display text-lg font-bold text-heading">Actively interviewing · Chicago or remote</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {externalLinks.map((item) => (
                <a className={textLinkClass} href={item.href} key={item.href} rel={item.href.startsWith('http') ? 'noreferrer' : undefined} target={item.href.startsWith('http') ? '_blank' : undefined}>
                  {item.label}
                </a>
              ))}
              <Link className={textLinkClass} to="/archive">Archive</Link>
              <a className={textLinkClass} href="https://subcult.tv/support">Support my work through SUBCULT</a>
            </div>
          </div>
          <p className={`${monoLabelClass} lg:justify-self-end`}>Independent work / 2026</p>
        </footer>
      </div>
    </div>
  )
}

import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { monoLabelClass } from '../lib/styles'

const navigation = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
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

    mainRef.current?.focus()
  }, [location.pathname])

  return (
    <div className="relative min-h-screen bg-paper text-ink selection:bg-accent-green selection:text-paper font-body">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="mx-auto flex min-h-screen max-w-350 flex-col border-x-2 border-stroke bg-paper">
        <header className="grid gap-6 border-b-2 border-stroke p-5 md:p-8 lg:grid-cols-[minmax(0,32rem)_minmax(1.5rem,1fr)_minmax(360px,26rem)] lg:items-start">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span aria-hidden="true" className="h-3 w-3 bg-accent-green" />
              <p className={monoLabelClass}><span className="text-accent-pink">Patrick Fanella</span> &mdash; Full Stack Developer</p>
            </div>

            <div className="max-w-120">
              <p className="font-display text-[clamp(2.5rem,4vw,4rem)] font-bold leading-[0.95] tracking-[-0.04em] text-heading">
                Ships products. <span className="text-accent-teal">Full stack.</span> From<span className="text-accent-green"> Go </span>to<span className="text-accent-purple"> pixel perfect</span>.
              </p>
              <p className="mt-4 max-w-[40ch] text-[1.05rem] leading-relaxed text-ink-soft">
                Building production systems across Go APIs, React interfaces, AI pipelines, and real-time infrastructure. Every project here has been deployed, monitored, and used.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:col-start-3 lg:h-full lg:grid-rows-[auto_1fr_auto] lg:justify-items-end">
            <div className="grid gap-2 border-2 border-stroke bg-surface p-4 shadow-brutal transition-all hover:shadow-brutal-green lg:w-full lg:max-w-[320px]">
              <p className={monoLabelClass}>Stack</p>
              <p className="text-sm leading-relaxed text-ink-soft">
                Go / React / PostgreSQL / Python / TypeScript. From search infrastructure to smart contracts.
              </p>
            </div>

            <nav className="flex flex-wrap gap-3 lg:w-full lg:self-end lg:grid lg:grid-cols-3" aria-label="Primary navigation">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      'inline-flex min-w-0 cursor-pointer items-center justify-center border-2 px-4 py-2.5 text-center text-sm font-bold uppercase tracking-[0.05em] transition-all duration-150 ease-linear hover:-translate-x-1 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-x-0 active:translate-y-0 active:shadow-none lg:w-full',
                      isActive
                        ? 'border-heading bg-heading text-paper shadow-brutal-green focus-visible:ring-accent-green'
                        : 'border-stroke bg-surface text-heading hover:border-accent-purple hover:text-accent-purple hover:shadow-brutal-purple focus-visible:ring-accent-purple',
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

    		<main className="flex-1 p-5 md:p-8 focus-visible:outline-none" id="main-content" ref={mainRef} tabIndex={-1}>
          <Outlet />
        </main>

        <footer className="grid gap-6 border-t-2 border-stroke p-5 md:p-8 text-sm leading-relaxed text-ink-soft lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-start bg-surface">
          <p className="max-w-[30ch]">
            Polyglot engineering across Go, TypeScript, Python, and Solidity.
          </p>

          <p className={`${monoLabelClass} lg:justify-self-end text-accent-purple`}>
            2026 // SYSTEM ONLINE
          </p>
        </footer>
      </div>
    </div>
  )
}

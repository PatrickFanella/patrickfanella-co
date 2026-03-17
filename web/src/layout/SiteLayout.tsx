import { NavLink, Outlet } from 'react-router-dom'

import { monoLabelClass } from '../lib/styles'

const navigation = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

export function SiteLayout() {
  return (
    <div className="relative min-h-screen bg-paper text-ink selection:bg-accent-green selection:text-paper font-body">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <div className="mx-auto flex min-h-screen max-w-350 flex-col border-x-2 border-stroke bg-paper">
        <header className="grid gap-6 border-b-2 border-stroke p-5 md:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span aria-hidden="true" className="h-3 w-3 bg-accent-green" />
              <p className={monoLabelClass}><span className="text-accent-pink">Patrick Fanella</span> &mdash; Full Stack Developer</p>
            </div>

            <div className="grid max-w-260 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.48fr)] lg:items-start">
              <div>
                <p className="font-display text-[clamp(2.5rem,4vw,4rem)] font-bold leading-[0.95] tracking-[-0.04em] text-heading">
                  High contrast. <span className="text-accent-teal">Low latency.</span> Strict grids.
                </p>
                <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                  Engineering products with uncompromising functional clarity. Every component is justified, every interaction is deliberate.
                </p>
              </div>

              <div className="grid gap-2 border-2 border-stroke bg-surface p-4 shadow-brutal hover:shadow-brutal-green transition-all">
                <p className={monoLabelClass}>Stack</p>
                <p className="text-sm leading-relaxed text-ink-soft">
                  React frontend / Go API / PostgreSQL. Built to scale without the mental overhead.
                </p>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-3 lg:justify-end" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    'inline-flex cursor-pointer items-center justify-center border-2 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.05em] transition-all duration-150 ease-linear hover:-translate-x-1 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-x-0 active:translate-y-0 active:shadow-none',
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
        </header>

        <main id="main-content" className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>

        <footer className="grid gap-6 border-t-2 border-stroke p-5 md:p-8 text-sm leading-relaxed text-ink-soft lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-start bg-surface">
          <p className="max-w-[30ch]">
            Designed to communicate technical rigor over disposable polish.
          </p>
          <p className="max-w-[35ch]">
            Minimal brutalism meets Swiss precision. Built on React and Go.
          </p>
          <p className={`${monoLabelClass} lg:justify-self-end text-accent-purple`}>
            2026 // SYSTEM ONLINE
          </p>
        </footer>
      </div>
    </div>
  )
}

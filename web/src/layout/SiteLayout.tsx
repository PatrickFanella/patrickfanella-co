import { NavLink, Outlet } from 'react-router-dom'

import { monoLabelClass } from '../lib/styles'

const navigation = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

export function SiteLayout() {
  return (
    <div className="mx-auto my-2.5 w-[min(1180px,calc(100%-20px))] rounded-[30px] border border-stroke bg-[rgba(255,249,241,0.72)] p-4.5 shadow-portfolio backdrop-blur-xl md:my-6 md:w-[min(1180px,calc(100%-32px))] md:p-6">
      <header className="grid gap-6 px-1 py-2 pb-6 md:grid-cols-2 md:items-start">
        <div>
          <p className={monoLabelClass}>Patrick Fanella</p>
          <p className="mt-2 text-[1.02rem] text-ink-soft">Full stack developer portfolio</p>
        </div>
        <nav className="flex flex-wrap gap-3 md:justify-end" aria-label="Primary navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  'rounded-full px-3.5 py-2.5 text-sm transition duration-150 hover:-translate-y-0.5 focus-visible:-translate-y-0.5',
                  isActive
                    ? 'border border-heading bg-heading text-[#f8efe1]'
                    : 'text-ink-soft',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-6 grid gap-6 border-t border-stroke px-1 pt-7 md:grid-cols-2 md:items-start">
        <p className="text-ink-soft">
          Thoughtful interfaces, practical APIs, and project stories worth opening.
        </p>
        <p className={`${monoLabelClass} md:justify-self-start`}>
          Scaffolded with Vite, React, Go, and PostgreSQL.
        </p>
      </footer>
    </div>
  )
}

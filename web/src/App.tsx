import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { SiteNav } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { HomePage } from './pages/HomePage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ResumePage } from './pages/ResumePage'
import { ContactPage } from './pages/ContactPage'
import { DevlogPage } from './pages/DevlogPage'
import { NotFoundPage } from './pages/NotFoundPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only-focusable absolute top-2 left-2 z-[100] bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] px-3 py-1.5 rounded-md font-medium">
        Skip to content
      </a>
      <SiteNav />
      <ScrollToTop />
      <main id="main" className="flex-1 pt-14">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/tools" element={<Navigate to="/projects?kind=tool" replace />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/devlog" element={<DevlogPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

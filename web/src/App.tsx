import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { Analytics } from './components/Analytics'
import { SiteLayout } from './layout/SiteLayout'

const ArchivePage = lazy(() => import('./pages/ArchivePage').then((module) => ({ default: module.ArchivePage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })))
const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then((module) => ({ default: module.ProjectDetailPage })))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((module) => ({ default: module.ProjectsPage })))
const ResumePage = lazy(() => import('./pages/ResumePage').then((module) => ({ default: module.ResumePage })))

function App() {
  return (
    <>
      <Analytics />
      <Suspense fallback={<p className="p-8 font-mono text-sm uppercase text-accent-green" role="status">Loading page...</p>}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/transcript-create" element={<Navigate replace to="/projects/hasanara" />} />
            <Route path="projects/:slug" element={<ProjectDetailPage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="tools" element={<Navigate replace to="/archive#tools" />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App

import { HeroCarousel } from '../components/HeroCarousel'
import { ProjectSelection } from '../components/ProjectSelection'
import { ResumeContactCTA } from '../components/ResumeContactCTA'
import { SEO } from '../components/SEO'

export function HomePage() {
  return (
    <>
      <SEO
        title="Patrick Fanella | Full Stack Developer"
        description="Project-first portfolio: production systems in Go, React, PostgreSQL, AI pipelines, and infrastructure."
      />
      <HeroCarousel />
      <ProjectSelection />
      <ResumeContactCTA />
    </>
  )
}

import { HeroCarousel } from '../components/HeroCarousel'
import { ProjectSelection } from '../components/ProjectSelection'
import { ResumeContactCTA } from '../components/ResumeContactCTA'
import { SEO } from '../components/SEO'
import { DiagramGrid } from '../components/DiagramFrame'
import { crossCuttingDiagrams } from '../data/diagrams'

export function HomePage() {
  return (
    <>
      <SEO
        title="Patrick Fanella | Full Stack Developer"
        description="Project-first portfolio: production systems in Go, React, PostgreSQL, AI pipelines, and infrastructure."
      />
      <HeroCarousel />
      <ProjectSelection />
      <section className="container-page py-10 lg:py-14">
        <DiagramGrid diagrams={crossCuttingDiagrams} heading="Systems at a glance" />
      </section>
      <ResumeContactCTA />
    </>
  )
}

import { HeroCarousel } from '../components/HeroCarousel'
import { ProjectSelection } from '../components/ProjectSelection'
import { CategoryBrowser } from '../components/CategoryBrowser'
import { ToolsStrip } from '../components/ToolsStrip'
import { ResumeContactCTA } from '../components/ResumeContactCTA'
import { SEO } from '../components/SEO'
import { featuredProjects, allProjectsSorted } from '../data/portfolio'

export function HomePage() {
  // Carousel uses featured projects first, then fills with strong non-featured.
  const carouselPool = featuredProjects.length >= 3
    ? featuredProjects
    : [...featuredProjects, ...allProjectsSorted.filter((p) => !p.featured)].slice(0, 5)

  return (
    <>
      <SEO
        title="Patrick Fanella | Full Stack Developer"
        description="Project-first portfolio: production systems in Go, React, PostgreSQL, AI pipelines, and infrastructure."
      />
      <HeroCarousel projects={carouselPool} />
      <ProjectSelection />
      <CategoryBrowser />
      <ToolsStrip />
      <ResumeContactCTA />
    </>
  )
}

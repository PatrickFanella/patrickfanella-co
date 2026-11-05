import type { Project } from '../lib/api'

type ProjectBrandProps = { project: Project; className?: string }

export function ProjectBrand({ project, className = '' }: ProjectBrandProps) {
  if (!project.logoUrl) return null
  return (
    <span className={`project-brand ${className}`} style={{ backgroundColor: project.brandBackground || '#21222c' }}>
      <img alt="" className="h-full w-full object-contain" height={64} src={project.logoUrl} width={64} />
    </span>
  )
}

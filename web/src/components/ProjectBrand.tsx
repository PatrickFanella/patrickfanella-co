import type { Project } from '../lib/api'

type ProjectBrandProps = { project: Project; className?: string }

export function ProjectBrand({ project, className = '' }: ProjectBrandProps) {
  const words = project.title.trim().split(/[\s-]+/)
  const monogram = (words.length > 1 ? words.slice(0, 2).map((word) => word[0]).join('') : words[0].slice(0, 2)).toUpperCase()
  return (
    <span aria-hidden="true" className={`project-brand ${className}`} style={{ backgroundColor: project.brandBackground || '#21222c' }}>
      {project.logoUrl ? <img alt="" className="h-full w-full object-contain" height={64} src={project.logoUrl} width={64} /> : <span className="project-monogram font-mono text-lg font-bold text-accent-purple">{monogram}</span>}
    </span>
  )
}

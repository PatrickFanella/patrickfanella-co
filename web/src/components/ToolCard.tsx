import type { Project } from '../lib/api'
import { monoLabelClass, surfaceCardClass, tagCompactClass, textLinkClass } from '../lib/styles'

type ToolCardProps = {
	project: Project
}

export function ToolCard({ project }: ToolCardProps) {
	const cardContent = (
		<>
			<div className="grid gap-5 border-b-2 border-stroke pb-4">
				<div className="flex flex-wrap items-start justify-between gap-3">
					<p className="border-2 border-stroke bg-panel px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent-pink">
						{project.role}
					</p>
					<p className="border-2 border-stroke bg-surface px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-heading">
						{project.year}
					</p>
				</div>

				<div>
					<h3 className="max-w-[16ch] font-display text-[2rem] font-bold leading-[0.92] tracking-[-0.05em] text-heading">
						{project.title}
					</h3>
					<p className="mt-3 max-w-[42ch] text-[0.98rem] leading-relaxed text-ink-soft">
						{project.summary}
					</p>
				</div>
			</div>

			<ul className="mt-4 flex list-none flex-wrap gap-1.5 p-0" aria-label={`${project.title} technology stack`}>
				{project.stack.slice(0, 8).map((item) => (
					<li key={item} className={tagCompactClass}>
						{item}
					</li>
				))}
			</ul>

			<div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-stroke pt-4">
				<p className={monoLabelClass}>Tool</p>
				{project.repoUrl ? (
					<span className={textLinkClass}>
						Open {project.title} Repository ↗
					</span>
				) : null}
			</div>
		</>
	)

	if (project.repoUrl) {
		return (
			<a
				aria-label={`Open ${project.title} repository`}
				className={`${surfaceCardClass} group flex h-full flex-col justify-between p-6 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}
				href={project.repoUrl}
				rel="noreferrer"
				target="_blank"
			>
				{cardContent}
			</a>
		)
	}

	return (
		<article className={`${surfaceCardClass} group flex h-full flex-col justify-between p-6 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}>
			{cardContent}
		</article>
	)
}

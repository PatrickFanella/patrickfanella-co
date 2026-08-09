import type { Project } from '../lib/api'
import { monoLabelClass, surfaceCardClass, textLinkClass } from '../lib/styles'
import { StackCueList } from './StackCueList'

type ToolCardProps = {
	project: Project
	density?: 'featured' | 'archive'
}


export function ToolCard({ project, density = 'featured' }: ToolCardProps) {
	const isArchive = density === 'archive'
	const maxVisibleStack = isArchive ? 2 : 3
	const cardContent = (
		<>
			<div className={`${isArchive ? 'gap-4' : 'gap-5'} grid border-b-2 border-stroke pb-4`}>
				<div className="flex flex-wrap items-start justify-between gap-3">
					{!isArchive ? (
						<p className="border-2 border-stroke bg-panel px-3 pt-[calc(0.25rem+0.5px)] pb-[calc(0.25rem-0.5px)] font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent-pink">
							{project.role}
						</p>
					) : null}
					<p className="border-2 border-stroke bg-surface px-3 pt-[calc(0.25rem+0.5px)] pb-[calc(0.25rem-0.5px)] font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-heading">
						{project.year}
					</p>
				</div>

				<div>
					<h3 className={`${isArchive ? 'max-w-[18ch] text-[1.6rem]' : 'max-w-[16ch] text-[2rem]'} font-display font-bold leading-[0.92] tracking-[-0.05em] text-heading`}>
						{project.title}
					</h3>
					<p className={`${isArchive ? 'mt-2 text-[0.95rem]' : 'mt-3 text-[0.98rem]'} max-w-[42ch] leading-relaxed text-ink-soft`}>
						{project.summary}
					</p>
				</div>
			</div>

			<StackCueList ariaLabel={`${project.title} technology stack`} className="mt-4" items={project.stack} maxVisible={maxVisibleStack} />

			<div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-stroke pt-4">
				<p className={monoLabelClass}>{isArchive ? 'Repository' : 'Tool'}</p>
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
				className={`${surfaceCardClass} group flex h-full flex-col justify-between ${isArchive ? 'p-5' : 'p-6'} hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}
				href={project.repoUrl}
				rel="noreferrer"
				target="_blank"
			>
				{cardContent}
			</a>
		)
	}

	return (
		<article className={`${surfaceCardClass} group flex h-full flex-col justify-between ${isArchive ? 'p-5' : 'p-6'} hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}>
			{cardContent}
		</article>
	)
}

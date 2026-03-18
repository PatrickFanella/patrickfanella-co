import type { ElementType, ReactNode } from 'react'

import { monoLabelClass, surfaceCardClass } from '../lib/styles'

type RouteStateProps = {
	label: string
	title: string
	description: string
	actions?: ReactNode
	children?: ReactNode
	role?: 'alert' | 'status'
	ariaLive?: 'assertive' | 'polite'
	headingLevel?: 'h1' | 'h2' | 'h3'
	className?: string
}

export function RouteState({
	label,
	title,
	description,
	actions,
	children,
	role,
	ariaLive,
	headingLevel = 'h2',
	className = '',
}: RouteStateProps) {
	const Heading = headingLevel as ElementType

	return (
		<article
			aria-live={ariaLive}
			className={`${surfaceCardClass} grid gap-6 bg-panel p-8 ${className}`.trim()}
			role={role}
		>
			<div>
				<p className={monoLabelClass}>{label}</p>
				<Heading className="mt-5 font-display text-[2rem] font-bold uppercase tracking-[-0.04em] text-heading">
					{title}
				</Heading>
				<p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">{description}</p>
			</div>

			{children}

			{actions ? <div className="flex flex-wrap gap-4">{actions}</div> : null}
		</article>
	)
}

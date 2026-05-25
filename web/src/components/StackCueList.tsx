import { tagCompactClass } from '../lib/styles'

type StackCueListProps = {
	ariaLabel: string
	items: string[]
	maxVisible?: number
	className?: string
}

export function StackCueList({ ariaLabel, items, maxVisible = 3, className = '' }: StackCueListProps) {
	if (items.length === 0) {
		return null
	}

	const visibleItems = items.slice(0, maxVisible)
	const hiddenCount = Math.max(items.length - visibleItems.length, 0)

	return (
		<ul className={["flex list-none flex-wrap gap-1.5 p-0", className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
			{visibleItems.map((item) => (
				<li key={item} className={tagCompactClass}>
					{item}
				</li>
			))}
			{hiddenCount > 0 ? (
				<li aria-label={`${hiddenCount} more technologies`} className={`${tagCompactClass} text-accent-purple`}>
					+{hiddenCount}
				</li>
			) : null}
		</ul>
	)
}

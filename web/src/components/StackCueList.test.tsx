import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StackCueList } from './StackCueList'

describe('StackCueList', () => {
	it('shows only the requested number of stack cues and a remaining count', () => {
		render(
			<StackCueList ariaLabel="Example technology stack" items={['Go', 'PostgreSQL', 'React', 'Docker', 'OpenCode']} maxVisible={3} />,
		)

		const list = screen.getByRole('list', { name: 'Example technology stack' })
		expect(within(list).getByText('Go')).toBeInTheDocument()
		expect(within(list).getByText('PostgreSQL')).toBeInTheDocument()
		expect(within(list).getByText('React')).toBeInTheDocument()
		expect(within(list).getByText('+2')).toBeInTheDocument()
		expect(within(list).queryByText('Docker')).not.toBeInTheDocument()
		expect(within(list).queryByText('OpenCode')).not.toBeInTheDocument()
	})

	it('does not show a remaining count when every item is visible', () => {
		render(<StackCueList ariaLabel="Small technology stack" items={['TypeScript', 'Vite']} maxVisible={3} />)

		const list = screen.getByRole('list', { name: 'Small technology stack' })
		expect(within(list).getByText('TypeScript')).toBeInTheDocument()
		expect(within(list).getByText('Vite')).toBeInTheDocument()
		expect(within(list).queryByText(/^\+/)).not.toBeInTheDocument()
	})
})

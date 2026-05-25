import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ToolCard } from './ToolCard'

describe('ToolCard', () => {
	it('renders a direct repository link and no case study link', () => {
		renderInRouter(<ToolCard project={toolProject} />)

		expect(screen.getByRole('heading', { name: toolProject.title })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: `Open ${toolProject.title} repository` })).toHaveAttribute('href', toolProject.repoUrl)
		expect(screen.queryByRole('link', { name: /read case study/i })).not.toBeInTheDocument()
	})

	it('shows only two stack cues in archive density', () => {
		renderInRouter(<ToolCard density="archive" project={toolProject} />)

		expect(screen.getByText(toolProject.stack[0])).toBeInTheDocument()
		expect(screen.getByText(toolProject.stack[1])).toBeInTheDocument()
		expect(screen.queryByText(toolProject.stack[2])).not.toBeInTheDocument()
		expect(screen.getByText(`+${toolProject.stack.length - 2}`)).toBeInTheDocument()
	})
})

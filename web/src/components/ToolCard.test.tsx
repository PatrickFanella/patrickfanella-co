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
})

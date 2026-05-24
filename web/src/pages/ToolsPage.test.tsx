import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { projectsFixture, toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ToolsPage } from './ToolsPage'

describe('ToolsPage', () => {
	it('shows a loading state while the tool index is requested', () => {
		vi.spyOn(api, 'fetchProjects').mockReturnValue(new Promise(() => {}))

		renderInRouter(<ToolsPage />, '/tools')

		expect(screen.getByRole('status')).toHaveTextContent(/loading tool index/i)
	})

	it('renders only tools from the API response', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<ToolsPage />, '/tools')

		expect(await screen.findByRole('heading', { name: toolProject.title })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: 'Clpr' })).not.toBeInTheDocument()
		expect(screen.getByText(/showing 1 of 1 tool/i)).toBeInTheDocument()
	})

	it('filters tools by tag', async () => {
		const user = userEvent.setup()
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<ToolsPage />, '/tools')

		expect(await screen.findByRole('heading', { name: toolProject.title })).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'tmux' }))

		expect(screen.getByRole('heading', { name: toolProject.title })).toBeInTheDocument()
		expect(screen.getByText(/for tmux/i)).toBeInTheDocument()
	})

	it('renders an intentional empty-archive state when the API returns no tools', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([])

		renderInRouter(<ToolsPage />, '/tools')

		expect(await screen.findByRole('heading', { name: /the archive is empty/i })).toBeInTheDocument()
	})

	it('renders an error state when the tool index request fails', async () => {
		vi.spyOn(api, 'fetchProjects').mockRejectedValue(
			new api.ApiClientError(500, 'internal_error', 'Unable to load portfolio data.'),
		)

		renderInRouter(<ToolsPage />, '/tools')

		expect(await screen.findByRole('alert')).toHaveTextContent(/unable to load portfolio data/i)
	})
})

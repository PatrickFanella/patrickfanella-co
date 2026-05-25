import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ToolsPage } from './ToolsPage'

const toolsFixtureWithArchive = [
	toolProject,
	{
		...toolProject,
		slug: 'tmux-popups-archive-a',
		title: 'tmux-popups-archive-a',
		repoUrl: 'https://example.com/a',
	},
	{
		...toolProject,
		slug: 'tmux-popups-archive-b',
		title: 'tmux-popups-archive-b',
		repoUrl: 'https://example.com/b',
	},
	{
		...toolProject,
		slug: 'tmux-popups-archive-c',
		title: 'tmux-popups-archive-c',
		repoUrl: 'https://example.com/c',
	},
]

describe('ToolsPage', () => {
	it('shows a loading state while the tool index is requested', () => {
		vi.spyOn(api, 'fetchProjects').mockReturnValue(new Promise(() => {}))

		renderInRouter(<ToolsPage />, '/tools')

		expect(screen.getByRole('status')).toHaveTextContent(/loading tool index/i)
		expect(screen.getByText(/counts appear after the tool index loads/i)).toBeInTheDocument()
		expect(screen.queryByText(/0 featured/i)).not.toBeInTheDocument()
		expect(screen.queryByText(/0 archive/i)).not.toBeInTheDocument()
	})

	it('renders a featured tools section', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(toolsFixtureWithArchive)

		renderInRouter(<ToolsPage />, '/tools')

		expect(await screen.findByRole('heading', { name: /featured tools/i, level: 2 })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: /source archive/i, level: 2 })).toBeInTheDocument()
		expect(await screen.findByRole('heading', { name: toolProject.title })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: 'Clpr' })).not.toBeInTheDocument()
		expect(screen.getByText(/featured first/i)).toBeInTheDocument()
		expect(screen.getByText(/3 featured tools/i)).toBeInTheDocument()
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
		expect(screen.getByText(/counts appear after the tool index loads/i)).toBeInTheDocument()
		expect(screen.queryByText(/0 featured/i)).not.toBeInTheDocument()
		expect(screen.queryByText(/0 archive/i)).not.toBeInTheDocument()
	})
})

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { projectsFixture } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ProjectsPage } from './ProjectsPage'

describe('ProjectsPage', () => {
	it('shows a loading state while the project index is requested', () => {
		vi.spyOn(api, 'fetchProjects').mockReturnValue(new Promise(() => {}))

		renderInRouter(<ProjectsPage />, '/projects')

		expect(screen.getByRole('status')).toHaveTextContent(/loading project index/i)
	})

	it('renders all projects in a single list', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Clpr' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: 'Internet-ID' })).toBeInTheDocument()
	})

	it('filters projects by tag', async () => {
		const user = userEvent.setup()
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Clpr' })).toBeInTheDocument()
		await user.click(screen.getByRole('button', { name: 'IPFS' }))

		expect(screen.getByRole('heading', { name: 'Internet-ID' })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: 'Clpr' })).not.toBeInTheDocument()
	})

	it('renders an intentional empty-archive state when the API returns no projects', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([])

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: /the archive is empty/i })).toBeInTheDocument()
	})

	it('renders an error state when the project index request fails', async () => {
		vi.spyOn(api, 'fetchProjects').mockRejectedValue(
			new api.ApiClientError(500, 'internal_error', 'Unable to load portfolio data.'),
		)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('alert')).toHaveTextContent(/unable to load portfolio data/i)
	})
})

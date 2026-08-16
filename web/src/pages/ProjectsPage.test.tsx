import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { projectsFixture, toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ProjectsPage } from './ProjectsPage'

describe('ProjectsPage', () => {
	it('shows a loading state while the project index is requested', () => {
		vi.spyOn(api, 'fetchProjects').mockReturnValue(new Promise(() => {}))

		renderInRouter(<ProjectsPage />, '/projects')

		expect(screen.getByRole('status')).toHaveTextContent(/loading project index/i)
		expect(screen.queryByText(/0 featured/i)).not.toBeInTheDocument()
		expect(screen.queryByText(/0 archive/i)).not.toBeInTheDocument()
	})

	it('renders case studies and highlights while excluding tools', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Clpr' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: 'Internet-ID' })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: toolProject.title })).not.toBeInTheDocument()
	})

	it('renders an intentional empty-archive state when the API returns no projects', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([])

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: /case study archive is empty/i })).toBeInTheDocument()
	})

	it('renders an error state when the project index request fails', async () => {
		vi.spyOn(api, 'fetchProjects').mockRejectedValue(
			new api.ApiClientError(500, 'internal_error', 'Unable to load portfolio data.'),
		)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('alert')).toHaveTextContent(/unable to load portfolio data/i)
		expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
	})
})

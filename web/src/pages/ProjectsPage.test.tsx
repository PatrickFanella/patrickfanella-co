import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { projectsFixture } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ProjectsPage } from './ProjectsPage'

describe('ProjectsPage', () => {
	it('shows a loading state while the project index is requested', () => {
		vi.spyOn(api, 'fetchProjects').mockReturnValue(new Promise(() => {}))

		renderInRouter(<ProjectsPage />, '/projects')

		expect(screen.getByRole('status')).toHaveTextContent(/hydrating the featured set and archive/i)
	})

	it('renders featured and archived sections from live API data', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Patrick Fanella Portfolio' })).toBeInTheDocument()
		expect(screen.getByText('Archive')).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: 'Unique ID Rotating Logger' })).toBeInTheDocument()
	})

	it('renders an error state when the project index request fails', async () => {
		vi.spyOn(api, 'fetchProjects').mockRejectedValue(
			new api.ApiClientError(500, 'internal_error', 'Unable to load portfolio data.'),
		)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('alert')).toHaveTextContent(/unable to load portfolio data/i)
	})
})

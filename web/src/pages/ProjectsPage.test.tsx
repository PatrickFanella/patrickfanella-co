import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { featuredProject, projectsFixture, toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ProjectsPage } from './ProjectsPage'

describe('ProjectsPage', () => {
	it('shows a loading state while the project index is requested', () => {
		vi.spyOn(api, 'fetchProjects').mockReturnValue(new Promise(() => {}))

		renderInRouter(<ProjectsPage />, '/projects')

		expect(screen.getByRole('status')).toHaveTextContent(/loading the selected case studies/i)
		expect(screen.queryByText(/0 featured/i)).not.toBeInTheDocument()
		expect(screen.queryByText(/0 archive/i)).not.toBeInTheDocument()
	})

	it('renders only non-featured flagship case studies in the primary project journey', async () => {
		const nonFeaturedFlagship = { ...featuredProject, slug: 'clustr', title: 'Clustr', featured: false }
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([...projectsFixture, nonFeaturedFlagship])

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Clustr' })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: 'Clpr' })).not.toBeInTheDocument()
		expect(screen.queryByText('Internet-ID')).not.toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: toolProject.title })).not.toBeInTheDocument()
		expect(screen.queryByRole('link', { name: /archive/i })).not.toBeInTheDocument()
	})

	it('renders every selected flagship project', async () => {
		const selectedProjects = Array.from({ length: 7 }, (_, index) => ({
			...featuredProject,
			slug: `selected-${index + 1}`,
			title: `Selected Project ${index + 1}`,
			featured: false,
		}))
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(selectedProjects)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Selected Project 7' })).toBeInTheDocument()
	})

	it('renders an intentional empty-archive state when the API returns no projects', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([])

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: /selected work index is empty/i })).toBeInTheDocument()
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

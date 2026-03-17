import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { featuredProject } from '../test/fixtures'
import { renderRoute } from '../test/renderWithRouter'
import { ProjectDetailPage } from './ProjectDetailPage'

describe('ProjectDetailPage', () => {
	it('shows a loading state while the project detail request is in flight', () => {
		vi.spyOn(api, 'fetchProject').mockReturnValue(new Promise(() => {}))

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/patrickfanella-co')

		expect(screen.getByRole('status')).toHaveTextContent(/fetching the case study, supporting media, and architecture notes/i)
	})

	it('renders project detail data from the API', async () => {
		vi.spyOn(api, 'fetchProject').mockResolvedValue(featuredProject)

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/patrickfanella-co')

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: /system choices that mattered/i })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: /what the next version would keep/i })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /open repository/i })).toHaveAttribute(
			'href',
			featuredProject.repoUrl,
		)
	})

	it('omits optional rich-content sections when the project does not provide them', async () => {
		vi.spyOn(api, 'fetchProject').mockResolvedValue({
			...featuredProject,
			architecture: [],
			lessons: [],
			media: [],
		})

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/patrickfanella-co')

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: /system choices that mattered/i })).not.toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: /visual references for the build/i })).not.toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: /what the next version would keep/i })).not.toBeInTheDocument()
	})

	it('renders an intentional not-found route when the slug is missing', async () => {
		vi.spyOn(api, 'fetchProject').mockRejectedValue(
			new api.ApiClientError(404, 'project_not_found', 'Project not found.'),
		)

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/does-not-exist')

		expect(await screen.findByRole('heading', { name: /record not found/i })).toBeInTheDocument()
	})

	it('renders a retryable generic error state for non-404 failures', async () => {
		vi.spyOn(api, 'fetchProject').mockRejectedValue(
			new api.ApiClientError(500, 'internal_error', 'Unable to load portfolio data.'),
		)

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/patrickfanella-co')

		expect(await screen.findByRole('heading', { name: /unable to load record/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /retry lookup/i })).toBeInTheDocument()
	})
})

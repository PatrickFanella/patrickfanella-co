import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { featuredProject, toolProject } from '../test/fixtures'
import { renderRoute } from '../test/renderWithRouter'
import { ProjectDetailPage } from './ProjectDetailPage'

describe('ProjectDetailPage', () => {
	it('shows a loading state while the project detail request is in flight', () => {
		vi.spyOn(api, 'fetchProject').mockReturnValue(new Promise(() => {}))

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/clpr')

		expect(screen.getByRole('status')).toHaveTextContent(/fetching the project details, media, and architecture notes/i)
	})

	it('renders project detail data from the API', async () => {
		vi.spyOn(api, 'fetchProject').mockResolvedValue(featuredProject)

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/clpr')

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: /decisions and tradeoffs/i })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: /what i learned/i })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /view source/i })).toHaveAttribute(
			'href',
			featuredProject.repoUrl,
		)
		expect(screen.getByRole('link', { name: /discuss a role/i })).toHaveAttribute('href', '/contact')
	})

	it('sends tool projects to the tools archive route state', async () => {
		vi.spyOn(api, 'fetchProject').mockResolvedValue(toolProject)

		render(
			<HelmetProvider>
				<MemoryRouter initialEntries={['/projects/tmux-popups']}>
					<Routes>
						<Route element={<ProjectDetailPage />} path="/projects/:slug" />
						<Route element={<h1>Tools archive</h1>} path="/archive" />
					</Routes>
				</MemoryRouter>
			</HelmetProvider>,
		)

		expect(await screen.findByRole('heading', { name: /tools archive/i })).toBeInTheDocument()
	})

	it('omits optional rich-content sections when the project does not provide them', async () => {
		vi.spyOn(api, 'fetchProject').mockResolvedValue({
			...featuredProject,
			architecture: [],
			lessons: [],
			media: [],
		})

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/clpr')

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: /decisions and tradeoffs/i })).not.toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: /see it working/i })).not.toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: /what i learned/i })).not.toBeInTheDocument()
	})

	it('renders an intentional not-found route when the slug is missing', async () => {
		vi.spyOn(api, 'fetchProject').mockRejectedValue(
			new api.ApiClientError(404, 'project_not_found', 'Project not found.'),
		)

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/does-not-exist')

		expect(await screen.findByRole('heading', { name: /this case study isn't available/i })).toBeInTheDocument()
	})

	it('renders a retryable generic error state for non-404 failures', async () => {
		vi.spyOn(api, 'fetchProject').mockRejectedValue(
			new api.ApiClientError(500, 'internal_error', 'Unable to load portfolio data.'),
		)

		renderRoute(<ProjectDetailPage />, '/projects/:slug', '/projects/clpr')

		expect(await screen.findByRole('heading', { name: /unable to load case study/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
	})
})

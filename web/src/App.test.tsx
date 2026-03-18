import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import App from './App'
import * as api from './lib/api'
import { featuredProject, projectsFixture } from './test/fixtures'

function renderApp(route = '/') {
	return render(
		<HelmetProvider>
			<MemoryRouter initialEntries={[route]}>
				<App />
			</MemoryRouter>
		</HelmetProvider>,
	)
}

describe('App navigation flows', () => {
	it('navigates from the home page to the projects archive', async () => {
		const user = userEvent.setup()
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderApp('/')

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		await user.click(screen.getByRole('link', { name: /view case studies/i }))

		expect(await screen.findByRole('heading', { name: /projects/i })).toBeInTheDocument()
		await waitFor(() => {
			expect(document.title).toBe('Projects | Patrick Fanella')
		})
	})

	it('navigates from the projects archive to a project detail route', async () => {
		const user = userEvent.setup()
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)
		vi.spyOn(api, 'fetchProject').mockResolvedValue(featuredProject)

		renderApp('/projects')

		expect(await screen.findByRole('heading', { name: /projects/i })).toBeInTheDocument()
		await user.click(screen.getAllByRole('link', { name: /read case study/i })[0])

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		await waitFor(() => {
			expect(document.title).toBe(`${featuredProject.title} | Patrick Fanella`)
		})
	})
})

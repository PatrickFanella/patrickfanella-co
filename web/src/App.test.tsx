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
	it('renders a not-found page for unmatched routes', async () => {
		renderApp('/does-not-exist')

		expect(await screen.findByRole('heading', { name: /this page isn't available/i }, { timeout: 5000 })).toBeInTheDocument()
		await waitFor(() => {
			expect(document.title).toBe('Page not found | Patrick Fanella')
		})
	})

	it('navigates from the home page to the projects archive', async () => {
		const user = userEvent.setup()
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)
		const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
		const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus').mockImplementation(() => {})

		renderApp('/')

		expect(await screen.findByRole('heading', { name: featuredProject.title }, { timeout: 5000 })).toBeInTheDocument()
		await user.click(screen.getByRole('link', { name: /view case studies/i }))

		expect(await screen.findByRole('heading', { name: /projects/i }, { timeout: 5000 })).toBeInTheDocument()
		await waitFor(() => {
			expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
			expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
			expect(document.title).toBe('Projects | Patrick Fanella')
		})
	})

	it('keeps the tools archive available from primary navigation', async () => {
		const user = userEvent.setup()
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderApp('/')

		expect(await screen.findByRole('heading', { name: featuredProject.title }, { timeout: 5000 })).toBeInTheDocument()
		await user.click(screen.getByRole('link', { name: /^tools$/i }))

		expect(await screen.findByRole('heading', { level: 1, name: /^all projects$/i }, { timeout: 5000 })).toBeInTheDocument()
	})

	it('navigates from the projects archive to a project detail route', async () => {
		const user = userEvent.setup()
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)
		vi.spyOn(api, 'fetchProject').mockResolvedValue(featuredProject)

		renderApp('/projects')

		expect(await screen.findByRole('heading', { name: /projects/i }, { timeout: 5000 })).toBeInTheDocument()
		await user.click(await screen.findByRole('link', { name: /read case study/i }, { timeout: 5000 }))

		expect(await screen.findByRole('heading', { level: 1, name: featuredProject.title }, { timeout: 5000 })).toBeInTheDocument()
		await waitFor(() => {
			expect(document.title).toBe('Clpr | Patrick Fanella')
		})
	})
})

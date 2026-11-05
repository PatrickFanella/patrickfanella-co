import { render, screen, waitFor, within } from '@testing-library/react'
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

		expect(await screen.findByRole('heading', { name: /this page isn't available/i })).toBeInTheDocument()
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

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		await user.click(screen.getByRole('link', { name: /read the case studies/i }))

		expect(await screen.findByRole('heading', { name: /projects/i })).toBeInTheDocument()
		expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
		expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true })
		await waitFor(() => {
			expect(document.title).toBe('Projects | Senior full-stack and backend engineer | Patrick Fanella')
		})
	})

	it('includes the archive in primary navigation and the footer', async () => {
		const user = userEvent.setup()
		let resolveArchive!: (projects: typeof projectsFixture) => void
		const archiveRequest = new Promise<typeof projectsFixture>((resolve) => { resolveArchive = resolve })
		vi.spyOn(api, 'fetchProjects')
			.mockResolvedValueOnce(projectsFixture)
			.mockReturnValueOnce(archiveRequest)

		renderApp('/')

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		expect(screen.queryByRole('link', { name: /^tools$/i })).not.toBeInTheDocument()
		await user.click(within(screen.getByRole('navigation', { name: 'Primary navigation' })).getByRole('link', { name: /^archive$/i }))

		expect(await screen.findByRole('heading', { level: 1, name: /^archive$/i })).toBeInTheDocument()
		expect(screen.queryByRole('link', { name: 'View project: Subcorp' })).not.toBeInTheDocument()
		resolveArchive(projectsFixture)
		expect(await screen.findByRole('link', { name: 'View project: Subcorp' })).toHaveAttribute('href', '/projects/subcorp')
	})

	it('navigates from the projects archive to a project detail route', async () => {
		const user = userEvent.setup()
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)
		vi.spyOn(api, 'fetchProject').mockResolvedValue(featuredProject)

		renderApp('/projects')

		expect(await screen.findByRole('heading', { name: /projects/i })).toBeInTheDocument()
		await user.click(await screen.findByRole('link', { name: /read case study/i }))

		expect(await screen.findByRole('heading', { level: 1, name: featuredProject.title })).toBeInTheDocument()
		await waitFor(() => {
			expect(document.title).toBe('Clpr case study | Go, React and hybrid search | Patrick Fanella')
		})
	})

	it('routes the historical transcript core URL to Rekolekt', async () => {
		const core = { ...featuredProject, slug: 'rekolekt', title: 'Rekolekt' }
		const fetchProject = vi.spyOn(api, 'fetchProject').mockResolvedValue(core)
		renderApp('/projects/transcript-create')
		expect(await screen.findByRole('heading', { level: 1, name: 'Rekolekt' })).toBeInTheDocument()
		expect(fetchProject).toHaveBeenCalledWith('rekolekt')
	})

	it('routes the tools shortcut to the selected project collection', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)
		renderApp('/tools')
		expect(await screen.findByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument()
		expect(await screen.findByRole('region', { name: 'Developer Tools' })).toBeInTheDocument()
	})
})

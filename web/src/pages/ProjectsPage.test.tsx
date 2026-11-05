import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import type { Project } from '../lib/api'
import { featuredProject, projectsFixture, toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ProjectsPage } from './ProjectsPage'

describe('ProjectsPage', () => {
	it('shows a loading state while the project index is requested', () => {
		vi.spyOn(api, 'fetchProjects').mockReturnValue(new Promise(() => {}))

		renderInRouter(<ProjectsPage />, '/projects')

		expect(screen.getByRole('status')).toHaveTextContent(/loading projects/i)
		expect(screen.queryByText(/0 featured/i)).not.toBeInTheDocument()
		expect(screen.queryByText(/0 archive/i)).not.toBeInTheDocument()
	})

	it('renders flagship case studies and an archive preview', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Clpr', level: 3 })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: 'Subcorp' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: toolProject.title })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: 'Browse the full archive' })).toHaveAttribute('href', '/archive')
	})

	it('renders the selected tools once, in order, linked to their public source', async () => {
		const curatedTools = ['subsets', 'tmux-popups', 'twitchdl'].map((slug): Project => ({
			...toolProject, slug, title: slug,
			repoUrl: `https://git.subcult.tv/PatrickFanella/${slug}`,
		}))
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([featuredProject, ...curatedTools, {
			...toolProject, selected: false, slug: 'omarchy-monitor-bar', title: 'Omarchy Monitor Bar',
		}])
		renderInRouter(<ProjectsPage />, '/projects')
		expect(await screen.findByRole('heading', { name: 'Clpr' })).toBeInTheDocument()
		const tools = screen.getByRole('region', { name: 'Developer Tools' })
		expect(within(tools).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual(['subsets', 'tmux-popups', 'twitchdl'])
		curatedTools.forEach((tool) => expect(within(tools).getByRole('link', { name: `View repository: ${tool.title}` })).toHaveAttribute('href', tool.repoUrl))
		expect(screen.queryByText('Omarchy Monitor Bar')).not.toBeInTheDocument()
	})

	it('filters both case studies and tools using technologies present in the response', async () => {
		const user = userEvent.setup()
		const pythonProject: Project = { ...featuredProject, slug: 'python-project', title: 'Python Project', stack: ['Python', 'FastAPI'] }
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([featuredProject, pythonProject, toolProject])
		renderInRouter(<ProjectsPage />, '/projects')
		expect(await screen.findByRole('heading', { name: 'Clpr' })).toBeInTheDocument()
		const filter = screen.getByRole('combobox', { name: 'Filter by technology' })
		expect(screen.queryByRole('option', { name: 'C#' })).not.toBeInTheDocument()
		await user.selectOptions(filter, 'Python')
		expect(screen.queryByRole('heading', { name: 'Clpr' })).not.toBeInTheDocument()
		expect(screen.getByRole('heading', { name: 'Python Project' })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: toolProject.title })).not.toBeInTheDocument()
		expect(screen.getByRole('status')).toHaveTextContent('1 project using Python')
		await user.click(screen.getByRole('button', { name: 'Clear filter' }))
		expect(filter).toHaveValue('')
		expect(screen.getByRole('heading', { name: 'Clpr' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: toolProject.title })).toBeInTheDocument()
	})

	it('keeps filtering available when the response contains only tools', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([toolProject])
		renderInRouter(<ProjectsPage />, '/projects')
		expect(await screen.findByRole('combobox', { name: 'Filter by technology' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: toolProject.title })).toBeInTheDocument()
	})

	it('renders every selected flagship project', async () => {
		const selectedProjects = Array.from({ length: 7 }, (_, index) => ({
			...featuredProject,
			slug: `selected-${index + 1}`,
			title: `Selected Project ${index + 1}`,
		}))
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(selectedProjects)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Selected Project 7' })).toBeInTheDocument()
	})

	it('renders an intentional empty-archive state when the API returns no projects', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([])

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: /no projects found/i })).toBeInTheDocument()
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

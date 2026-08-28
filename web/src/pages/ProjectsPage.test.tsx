import { screen, within } from '@testing-library/react'
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

	it('renders flagship case studies and excludes unrelated projects', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Clpr' })).toBeInTheDocument()
		expect(screen.queryByText('Internet-ID')).not.toBeInTheDocument()
		expect(screen.getByRole('heading', { name: toolProject.title })).toBeInTheDocument()
		expect(screen.queryByRole('link', { name: /archive/i })).not.toBeInTheDocument()
	})

	it('renders the curated tools once and in the requested order', async () => {
		const curatedToolDetails: Array<[string, string, Project['kind'], string]> = [
			['switchyard', 'Switchyard', 'highlight', 'https://git.subcult.tv/subculture-collective/switchyard'],
			['blacktower', 'Blacktower', 'highlight', 'https://git.subcult.tv/subculture-collective/blacktower'],
			['tmux-popups', 'tmux-popups', 'tool', 'https://github.com/PatrickFanella/tmux-popups'],
			['obsidian-plugin-metronome-tuner', 'obsidian-plugin-metronome-tuner', 'tool', 'https://github.com/PatrickFanella/obsidian-plugin-metronome-tuner'],
			['omarchy-plugin-shelfish', 'omarchy-plugin-shelfish', 'tool', 'https://github.com/PatrickFanella/omarchy-plugin-shelfish'],
			['omarchy-plugin-superproductivity', 'omarchy-plugin-superproductivity', 'tool', 'https://github.com/PatrickFanella/omarchy-superproductivity'],
			['omarchy-monitor-bar', 'omarchy-monitor-bar', 'tool', 'https://github.com/PatrickFanella/omarchy-monitor-bar'],
		]
		const curatedTools = curatedToolDetails.map(([slug, title, kind, repoUrl]): Project => ({
			...toolProject,
			slug,
			title,
			kind,
			repoUrl,
			classification: slug === 'switchyard' ? 'flagship' : 'archive',
		}))
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([
			featuredProject,
			...curatedTools,
			toolProject,
		])

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByRole('heading', { name: 'Clpr' })).toBeInTheDocument()
		const tools = screen.getByRole('region', { name: 'Tools' })
		expect(within(tools).getByRole('heading', { name: 'Tools' })).toBeInTheDocument()
		expect(
			within(tools).getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
		).toEqual(curatedToolDetails.map(([, title]) => title))
		const switchyardLink = within(tools).getByRole('link', { name: 'View project: Switchyard' })
		expect(switchyardLink).toHaveAttribute('href', '/projects/switchyard')
		expect(switchyardLink).not.toHaveAttribute('target')
		expect(switchyardLink).not.toHaveAttribute('rel')
		const repositoryLinks = curatedToolDetails.slice(1).map(([, title]) =>
			within(tools).getByRole('link', { name: `View repository: ${title}` }),
		)
		expect(repositoryLinks.map((link) => link.getAttribute('href'))).toEqual(
			curatedTools.slice(1).map((tool) => tool.repoUrl),
		)
		expect(repositoryLinks.every((link) => link.getAttribute('target') === '_blank')).toBe(true)
		expect(repositoryLinks.every((link) => link.getAttribute('rel') === 'noreferrer')).toBe(true)
		expect(within(tools).getAllByRole('link')).toEqual([switchyardLink, ...repositoryLinks])
		expect(screen.getAllByRole('heading', { name: 'Switchyard' })).toHaveLength(1)
		expect(within(tools).getByRole('heading', { name: 'tmux-popups' })).toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: 'tmux-plugins' })).not.toBeInTheDocument()
	})

	it('explains that card colors match the named stack technologies', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([featuredProject])

		renderInRouter(<ProjectsPage />, '/projects')

		expect(await screen.findByText(/legend names the technologies/i)).toHaveTextContent(/card colors match it/i)
		expect(screen.queryByText(/hover over a marker/i)).not.toBeInTheDocument()
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

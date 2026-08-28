import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { featuredProject, projectsFixture, toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { HomePage } from './HomePage'

describe('HomePage', () => {
	it('shows a loading state while featured projects are requested', () => {
		vi.spyOn(api, 'fetchProjects').mockReturnValue(new Promise(() => {}))

		renderInRouter(<HomePage />)

		expect(screen.getByRole('status')).toHaveTextContent(/loading case studies/i)
	})

	it('renders featured projects from the API response', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(projectsFixture)

		renderInRouter(<HomePage />)

		expect(await screen.findByRole('heading', { name: featuredProject.title })).toBeInTheDocument()
		expect(screen.getByRole('heading', { name: /backend depth\. usable products\. shipped end to end\./i })).toBeInTheDocument()
		expect(screen.getByRole('link', { name: /read the case studies/i })).toHaveAttribute('href', '/projects')
		expect(screen.getByRole('link', { name: /tell me about a role/i })).toHaveAttribute('href', '/contact')
		expect(document.title).toBe('Patrick Fanella | Senior Full-Stack and Backend Engineer')
		expect(screen.queryByRole('heading', { name: 'Internet-ID' })).not.toBeInTheDocument()
		expect(screen.queryByRole('heading', { name: toolProject.title })).not.toBeInTheDocument()
		expect(screen.queryByRole('link', { name: /archive/i })).not.toBeInTheDocument()
		expect(screen.queryByText(/886k/i)).not.toBeInTheDocument()
		expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
			'content',
			'Patrick Fanella builds Go and Python services, PostgreSQL data systems, and accessible React interfaces.',
		)
		expect(document.querySelector('meta[property="og:image:alt"]')).toHaveAttribute(
			'content',
			'Patrick Fanella portfolio preview',
		)
		const personSchema = JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!)
		expect(personSchema.homeLocation).toEqual({
			'@type': 'Place',
			name: 'Chicago, Illinois',
		})
		expect(personSchema).not.toHaveProperty('jobLocation')
	})

	it('renders the full selected project collection without a three-card cap', async () => {
		const selectedProjects = Array.from({ length: 7 }, (_, index) => ({
			...featuredProject,
			slug: `selected-${index + 1}`,
			title: `Selected Project ${index + 1}`,
		}))
		vi.spyOn(api, 'fetchProjects').mockResolvedValue(selectedProjects)

		renderInRouter(<HomePage />)

		expect(await screen.findByRole('heading', { name: 'Selected Project 7' })).toBeInTheDocument()
	})

	it('renders a recoverable error state when the featured query fails', async () => {
		vi.spyOn(api, 'fetchProjects').mockRejectedValue(
			new api.ApiClientError(503, 'database_unavailable', 'Featured case studies are temporarily unavailable.'),
		)

		renderInRouter(<HomePage />)

		expect(await screen.findByRole('alert')).toHaveTextContent(/temporarily unavailable/i)
		expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
	})
})

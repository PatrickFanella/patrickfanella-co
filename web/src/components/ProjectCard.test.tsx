import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { featuredProject, toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ProjectCard } from './ProjectCard'

describe('ProjectCard', () => {
	it('links to the project detail page', () => {
		renderInRouter(<ProjectCard project={featuredProject} />)

		expect(screen.getByRole('link', { name: /read case study/i })).toHaveAttribute('href', `/projects/${featuredProject.slug}`)
	})

	it('links curated projects with repositories directly to their source', () => {
		renderInRouter(<ProjectCard linkToRepository project={toolProject} />)

		const link = screen.getByRole('link', { name: `View repository: ${toolProject.title}` })
		expect(link).toHaveAttribute('href', toolProject.repoUrl)
		expect(link).toHaveAttribute('target', '_blank')
		expect(link).toHaveAttribute('rel', 'noreferrer')
	})

	it('shows an honest status for curated projects without repositories', () => {
		renderInRouter(<ProjectCard linkToRepository project={{ ...toolProject, repoUrl: undefined }} />)

		expect(screen.getByText('Source unavailable')).toBeInTheDocument()
		expect(screen.queryByRole('link', { name: /view tool/i })).not.toBeInTheDocument()
	})

	it('keeps the default tool CTA linked to project details', () => {
		renderInRouter(<ProjectCard project={toolProject} />)

		expect(screen.getByRole('link', { name: `View tool: ${toolProject.title}` })).toHaveAttribute(
			'href',
			`/projects/${toolProject.slug}`,
		)
	})

	it('shows technology names without needing a pointer or color legend', () => {
		renderInRouter(<ProjectCard project={featuredProject} />)
		expect(screen.getByRole('list', { name: 'Clpr technologies' })).toBeInTheDocument()
		featuredProject.stack.forEach((tech) => expect(screen.getByText(tech)).toBeVisible())
	})

	it('shows screenshots with their fixture disclosures', () => {
		renderInRouter(<ProjectCard project={{ ...featuredProject, media: [{
			src: '/assets/projects/screenshots/clpr-feed-1440.webp',
			alt: 'Clpr feed with synthetic clips',
			caption: 'Synthetic fixture; no user data is shown.',
		}] }} />)
		expect(screen.getByRole('img', { name: 'Clpr feed with synthetic clips' })).toHaveAttribute('loading', 'lazy')
		expect(screen.getByText('Synthetic fixture; no user data is shown.')).toBeVisible()
	})
})

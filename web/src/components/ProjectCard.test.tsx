import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { featuredProject, toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ProjectCard } from './ProjectCard'

describe('ProjectCard', () => {
	it('links to the project detail page', () => {
		renderInRouter(<ProjectCard order={1} project={featuredProject} />)

		expect(screen.getByRole('link', { name: /read case study/i })).toHaveAttribute('href', `/projects/${featuredProject.slug}`)
	})

	it('links curated projects with repositories directly to their source', () => {
		renderInRouter(<ProjectCard linkToRepository order={1} project={toolProject} />)

		const link = screen.getByRole('link', { name: `View repository: ${toolProject.title}` })
		expect(link).toHaveAttribute('href', toolProject.repoUrl)
		expect(link).toHaveAttribute('target', '_blank')
		expect(link).toHaveAttribute('rel', 'noreferrer')
	})

	it('shows an honest status for curated projects without repositories', () => {
		renderInRouter(<ProjectCard linkToRepository order={1} project={{ ...toolProject, repoUrl: undefined }} />)

		expect(screen.getByText('Source unavailable')).toBeInTheDocument()
		expect(screen.queryByRole('link', { name: /view tool/i })).not.toBeInTheDocument()
	})

	it('keeps the default tool CTA linked to project details', () => {
		renderInRouter(<ProjectCard order={1} project={toolProject} />)

		expect(screen.getByRole('link', { name: `View tool: ${toolProject.title}` })).toHaveAttribute(
			'href',
			`/projects/${toolProject.slug}`,
		)
	})

	it('renders all stack technologies as pips with accessible labels', () => {
		renderInRouter(<ProjectCard order={1} project={featuredProject} />)

		featuredProject.stack.forEach((tech) => {
			expect(screen.getByLabelText(tech)).toBeInTheDocument()
		})
	})
})

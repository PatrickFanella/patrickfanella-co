import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { featuredProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ProjectCard } from './ProjectCard'

describe('ProjectCard', () => {
	it('links to the project detail page', () => {
		renderInRouter(<ProjectCard order={1} project={featuredProject} />)

		expect(screen.getByRole('link', { name: /read case study/i })).toHaveAttribute('href', `/projects/${featuredProject.slug}`)
	})

	it('renders all stack technologies as pips with accessible labels', () => {
		renderInRouter(<ProjectCard order={1} project={featuredProject} />)

		featuredProject.stack.forEach((tech) => {
			expect(screen.getByLabelText(tech)).toBeInTheDocument()
		})
	})
})

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

	it('shows a focused stack cue list instead of the full stack', () => {
		renderInRouter(<ProjectCard density="featured" order={1} project={featuredProject} />)

		expect(screen.getByText(featuredProject.stack[0])).toBeInTheDocument()
		expect(screen.getByText(featuredProject.stack[1])).toBeInTheDocument()
		expect(screen.getByText(featuredProject.stack[2])).toBeInTheDocument()
		expect(screen.queryByText(featuredProject.stack[3])).not.toBeInTheDocument()
		expect(screen.getByText(`+${featuredProject.stack.length - 3}`)).toBeInTheDocument()
	})
})

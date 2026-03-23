import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProjectMediaGallery } from './ProjectMediaGallery'

describe('ProjectMediaGallery', () => {
	it('renders provided project media content', () => {
		render(
			<ProjectMediaGallery
				projectTitle="Demo project"
				items={[
					{
						src: '/assets/projects/demo.svg',
						alt: 'Demo project poster',
						caption: 'Launch placeholder visual.',
					},
				]}
			/>,
		)

		expect(screen.getByAltText(/demo project poster/i)).toBeInTheDocument()
		expect(screen.getByRole('figure')).toBeInTheDocument()
	})

	it('falls back gracefully when an image fails to load', () => {
		render(
			<ProjectMediaGallery
				projectTitle="Demo project"
				items={[
					{
						src: '/assets/projects/missing.svg',
						alt: 'Broken visual',
						caption: 'This asset should fall back.',
					},
				]}
			/>,
		)

		const image = screen.getByRole('img', { name: /broken visual/i })
		fireEvent.error(image)

		expect(screen.getByRole('img', { name: /demo project placeholder artwork/i })).toHaveAttribute(
			'src',
			'/assets/projects/project-fallback.svg',
		)
	})
})

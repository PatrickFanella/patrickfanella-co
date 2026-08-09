import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

	it('opens a modal dialog, focuses close, and restores focus to Expand', async () => {
		const user = userEvent.setup()
		render(
			<ProjectMediaGallery
				projectTitle="Demo project"
				items={[{ src: '/assets/projects/demo.svg', alt: 'Demo project poster', caption: 'Demo screen' }]}
			/>,
		)

		const expand = screen.getByRole('button', { name: /expand demo screen/i })
		await user.click(expand)
		expect(screen.getByRole('dialog', { name: /demo screen/i })).toBeInTheDocument()
		const close = screen.getByRole('button', { name: /^close$/i })
		expect(close).toHaveFocus()
		await user.click(close)
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		expect(expand).toHaveFocus()
	})
})

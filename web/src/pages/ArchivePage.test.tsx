import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { archivedProject, toolProject } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ArchivePage } from './ArchivePage'

describe('ArchivePage', () => {
	it('omits detail links for tools and keeps available repository links', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([
			archivedProject,
			toolProject,
			{ ...toolProject, repoUrl: undefined, slug: 'private-tool', title: 'Private Tool' },
		])

		renderInRouter(<ArchivePage />, '/archive')

		const toolCard = (await screen.findByRole('heading', { name: toolProject.title })).closest('article')
		const privateToolCard = screen.getByRole('heading', { name: 'Private Tool' }).closest('article')

		expect(toolCard).not.toBeNull()
		expect(privateToolCard).not.toBeNull()
		expect(within(toolCard!).getByRole('link', { name: /repository/i })).toHaveAttribute('href', toolProject.repoUrl)
		expect(within(toolCard!).queryByRole('link', { name: /view project/i })).not.toBeInTheDocument()
		expect(within(privateToolCard!).queryByRole('link')).not.toBeInTheDocument()
		expect(document.querySelector('#tools')).toBeInTheDocument()
	})

	it('keeps detail links for non-tool archive projects', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([archivedProject])

		renderInRouter(<ArchivePage />, '/archive')

		expect(await screen.findByRole('link', { name: /view project/i })).toHaveAttribute(
			'href',
			`/projects/${archivedProject.slug}`,
		)
	})

	it('focuses the developer tools section when linked by hash', async () => {
		vi.spyOn(api, 'fetchProjects').mockResolvedValue([toolProject])

		renderInRouter(<ArchivePage />, '/archive#tools')

		const toolsSection = (await screen.findByRole('heading', { name: 'Developer Tools' })).closest('section')
		expect(toolsSection).toHaveAttribute('id', 'tools')
		expect(toolsSection).toHaveAttribute('tabindex', '-1')
		expect(toolsSection).toHaveFocus()
	})
})

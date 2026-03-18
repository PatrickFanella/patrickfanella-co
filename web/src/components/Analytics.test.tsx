import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

import { Analytics } from './Analytics'

describe('Analytics', () => {
	afterEach(() => {
		vi.unstubAllEnvs()
		document.getElementById('plausible-analytics-script')?.remove()
		delete window.plausible
		delete window.plausibleq
	})

	it('stays disabled when no analytics domain is configured', () => {
		render(
			<MemoryRouter>
				<Analytics />
			</MemoryRouter>,
		)

		expect(document.getElementById('plausible-analytics-script')).not.toBeInTheDocument()
	})

	it('injects the plausible script and tracks page views plus outbound clicks', async () => {
		const plausible = vi.fn()
		window.plausible = plausible
		vi.stubEnv('VITE_SITE_URL', 'https://patrickfanella.co')
		vi.stubEnv('VITE_ANALYTICS_PLAUSIBLE_DOMAIN', 'patrickfanella.co')
		vi.stubEnv('VITE_ANALYTICS_PLAUSIBLE_SCRIPT_URL', 'https://analytics.example/js/script.js')

		const user = userEvent.setup()
		render(
			<MemoryRouter initialEntries={['/contact?ref=qa']}>
				<Analytics />
				<a href="https://github.com/PatrickFanella">GitHub</a>
			</MemoryRouter>,
		)

		await waitFor(() => {
			expect(document.getElementById('plausible-analytics-script')).toBeInTheDocument()
			expect(plausible).toHaveBeenCalledWith('pageview', {
				u: 'https://patrickfanella.co/contact?ref=qa',
			})
		})

		expect(document.getElementById('plausible-analytics-script')).toHaveAttribute(
			'src',
			'https://analytics.example/js/script.js',
		)

		await user.click(screen.getByRole('link', { name: 'GitHub' }))

		expect(plausible).toHaveBeenCalledWith('Outbound Link: Click', {
			props: {
				destination: 'github.com',
			},
		})
	})
})

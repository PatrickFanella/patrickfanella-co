import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import * as api from '../lib/api'
import { contactSubmissionFixture } from '../test/fixtures'
import { renderInRouter } from '../test/renderWithRouter'
import { ContactPage } from './ContactPage'

async function fillContactForm() {
	const user = userEvent.setup()

	await user.type(screen.getByLabelText(/parameter: name/i), 'Patrick Fanella')
	await user.type(screen.getByLabelText(/parameter: email/i), 'patrick@example.com')
	await user.type(
		screen.getByLabelText(/payload: message/i),
		'I would love to talk about one of your featured case studies.',
	)

	await user.click(screen.getByRole('button', { name: /send message/i }))

	return user
}

describe('ContactPage', () => {
	it('submits successfully against the live API client', async () => {
		vi.spyOn(api, 'submitContact').mockResolvedValue(contactSubmissionFixture)

		renderInRouter(<ContactPage />, '/contact')
		expect(screen.getByRole('link', { name: /open github/i })).toHaveAttribute(
			'href',
			'https://github.com/PatrickFanella',
		)

		await fillContactForm()

		expect(await screen.findByRole('status')).toHaveTextContent(/thanks — your note has been saved/i)
		expect(api.submitContact).toHaveBeenCalledWith({
			name: 'Patrick Fanella',
			email: 'patrick@example.com',
			message: 'I would love to talk about one of your featured case studies.',
			website: '',
		})
	})

	it('maps structured server-side validation errors back onto the form', async () => {
		vi.spyOn(api, 'submitContact').mockRejectedValue(
			new api.ApiClientError(400, 'validation_error', 'Please correct the highlighted fields.', {
				message: 'Please add implementation scope before sending.',
			}),
		)

		renderInRouter(<ContactPage />, '/contact')

		await fillContactForm()

		expect(await screen.findByText(/please add implementation scope before sending/i)).toBeInTheDocument()
		expect(screen.getByText(/please correct the highlighted fields/i)).toBeInTheDocument()
	})

	it('shows a friendly network failure message when the API is unreachable', async () => {
		vi.spyOn(api, 'submitContact').mockRejectedValue(
			new api.ApiClientError(0, 'network_error', 'The API is not reachable right now.'),
		)

		renderInRouter(<ContactPage />, '/contact')

		await fillContactForm()

		expect(await screen.findByRole('alert')).toHaveTextContent(/could not be reached/i)
	})
})

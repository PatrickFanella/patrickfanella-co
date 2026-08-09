import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderInRouter } from '../test/renderWithRouter'
import { ResumePage } from './ResumePage'

describe('ResumePage', () => {
	it('uses a browser-safe image preview and exposes the PDF directly', () => {
		renderInRouter(<ResumePage />, '/resume')

		expect(screen.getByRole('img', { name: /preview of patrick fanella.*résumé/i })).toHaveAttribute(
			'src',
			'/assets/patrick_fanella_resume.webp',
		)
		expect(screen.getAllByRole('link', { name: /download pdf/i })[0]).toHaveAttribute(
			'href',
			'/assets/patrick_fanella_resume.pdf',
		)
		expect(document.querySelector('object')).not.toBeInTheDocument()
	})
})

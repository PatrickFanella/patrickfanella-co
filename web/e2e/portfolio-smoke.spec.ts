import { expect, test } from '@playwright/test'

test('visitor can browse featured work and submit the contact form', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('heading', { name: /products that ship/i })).toBeVisible()

	await page.getByRole('link', { name: /open master archive/i }).click()
	await expect(page).toHaveURL(/\/projects$/)
	await expect(page.getByRole('heading', { name: /all projects/i })).toBeVisible()

	await page.getByRole('link', { name: /view detail/i }).first().click()
	await expect(page).toHaveURL(/\/projects\/clpr$/)
	await expect(page.getByRole('heading', { name: /clpr/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /open repository/i })).toBeVisible()

	await page.goto('/contact')
	await page.getByLabel(/parameter: name/i).fill('Patrick Fanella')
	await page.getByLabel(/parameter: email/i).fill('patrick@example.com')
	await page
		.getByLabel(/payload: message/i)
		.fill('I would love to talk about one of your featured case studies.')

	await page.getByRole('button', { name: /send message/i }).click()
	await expect(page.getByRole('status')).toContainText('Thanks — your note has been saved.')
})

test('missing project routes render the intentional not-found experience', async ({ page }) => {
	await page.goto('/projects/does-not-exist')

	await expect(page.getByRole('heading', { name: /record not found/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /return to index/i })).toBeVisible()
})

import { expect, test } from '@playwright/test'

test('visitor can browse featured work and submit the contact form', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('heading', { name: /backend depth/i })).toBeVisible()

	await page.getByRole('link', { name: /browse all projects/i }).click()
	await expect(page).toHaveURL(/\/projects$/)
	await expect(page.getByRole('heading', { name: /^projects$/i })).toBeVisible()

	await page.getByRole('link', { name: /read case study/i }).first().click()
	await expect(page).toHaveURL(/\/projects\/clpr$/)
	await expect(page.getByRole('heading', { name: /clpr/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /view repository/i })).toBeVisible()

	await page.goto('/contact')
	await page.getByLabel(/^name$/i).fill('Patrick Fanella')
	await page.getByLabel(/^email$/i).fill('patrick@example.com')
	await page
		.getByLabel(/^message$/i)
		.fill('I would love to talk about one of your featured case studies.')

	await page.getByRole('button', { name: /send message/i }).click()
	await expect(page.getByRole('status')).toContainText('Thanks. Your note has been saved.')
})

test('missing project routes render the intentional not-found experience', async ({ page }) => {
	await page.goto('/projects/does-not-exist')

	await expect(page.getByRole('heading', { name: /this case study isn't available/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /back to projects/i })).toBeVisible()
})

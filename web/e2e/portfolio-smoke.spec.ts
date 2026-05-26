import { expect, test } from '@playwright/test'

test('visitor can browse featured work and submit the contact form', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('heading', { name: /shipping systems with a product brain/i })).toBeVisible()

	await page.getByRole('link', { name: /browse projects/i }).click()
	await expect(page).toHaveURL(/\/projects$/)
	await expect(page.getByRole('heading', { name: /projects \+ tools, one archive/i })).toBeVisible()

	await page.getByRole('link', { name: /clpr/i }).first().click()
	await expect(page).toHaveURL(/\/projects\/clpr$/)
	await expect(page.getByRole('heading', { name: /clpr/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /repo/i })).toBeVisible()

	await page.goto('/contact')
	await page.getByLabel(/^name$/i).fill('Patrick Fanella')
	await page.getByLabel(/^email$/i).fill('patrick@example.com')
	await page
		.getByLabel(/^message$/i)
		.fill('I would love to talk about one of your featured case studies.')

	await page.getByRole('button', { name: /send message/i }).click()
	await expect(page.getByRole('status')).toContainText('Sent. I should see this fast.')
})

test('missing project routes render the intentional not-found experience', async ({ page }) => {
	await page.goto('/projects/does-not-exist')

	await expect(page.getByRole('heading', { name: /this page isn't here/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /projects/i }).first()).toBeVisible()
})

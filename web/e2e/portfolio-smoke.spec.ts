import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('visitor can browse featured work and submit the contact form', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('heading', { name: /backend depth\. product ownership/i })).toBeVisible()

	await page.getByRole('link', { name: /review the case studies/i }).click()
	await expect(page).toHaveURL(/\/projects$/)
	await expect(page.getByRole('heading', { name: /^projects$/i })).toBeVisible()

	await page.getByRole('link', { name: /read case study/i }).first().click()
	await expect(page).toHaveURL(/\/projects\/clpr$/)
	await expect(page.getByRole('heading', { name: /clpr/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /view source/i })).toBeVisible()

	await page.goto('/contact')
	await page.getByLabel(/^name$/i).fill('Patrick Fanella')
	await page.getByLabel(/^email$/i).fill('patrick@example.com')
	await page
		.getByLabel(/^message$/i)
		.fill('I would love to talk about one of your featured case studies.')

	await page.getByRole('button', { name: /send patrick a message/i }).click()
	await expect(page.getByRole('status')).toContainText('Thanks. Your note has been saved.')
})

test('production routing, metadata, and legacy redirects are correct', async ({ page, request }) => {
	const archived = await request.get('/projects/internet-id', { maxRedirects: 0 })
	expect(archived.status()).toBe(200)
	const archivedHtml = await archived.text()
	expect(archivedHtml).toContain('noindex,follow')

	const tools = await request.get('/tools', { maxRedirects: 0 })
	expect(tools.status()).toBe(308)
	expect(tools.headers().location).toBe('/archive#tools')

	const legacy = await request.get('/projects/transcript-create', { maxRedirects: 0 })
	expect(legacy.status()).toBe(308)
	expect(legacy.headers().location).toBe('/projects/hasanara')

	await page.goto('/projects/hasanara')
	await expect(page).toHaveTitle(/HasanAra/)
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://patrickfanella.co/projects/hasanara')
})

test('every sitemap URL resolves to its intended static document', async ({ request }) => {
	const sitemapResponse = await request.get('/sitemap.xml')
	expect(sitemapResponse.status()).toBe(200)
	const sitemap = await sitemapResponse.text()
	const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname)
	expect(urls.length).toBeGreaterThan(0)

	for (const pathname of urls) {
		const response = await request.get(pathname, { maxRedirects: 0 })
		expect(response.status(), pathname).toBe(200)
		const html = await response.text()
		expect(html, pathname).toContain('<div id="root"></div>')
		expect(html, pathname).not.toContain('Page not found | Patrick Fanella')
	}
})

test('primary recruiter routes expose useful content in the first mobile viewport', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 })

	await page.goto('/')
	await expect(page.getByRole('heading', { name: /backend depth\. product ownership/i })).toBeInViewport()
	await expect(page.getByRole('link', { name: /review the case studies/i })).toBeInViewport()

	await page.goto('/projects')
	await expect(page.getByRole('heading', { name: /^projects$/i })).toBeInViewport()
	await expect(page.getByText(/projects showing production delivery/i)).toBeInViewport()

	await page.goto('/contact')
	await expect(page.getByRole('heading', { name: /tell me about the role/i })).toBeInViewport()
	await expect(page.getByText(/interviewing for senior full-stack/i)).toBeInViewport()
})

test('media dialog contains focus and restores it to the invoking control', async ({ page }) => {
	await page.goto('/projects/clpr')
	const expand = page.getByRole('button', { name: /expand/i }).first()
	await expand.click()
	await expect(page.getByRole('dialog')).toBeVisible()
	await expect(page.getByRole('button', { name: /^close$/i })).toBeFocused()
	await page.keyboard.press('Escape')
	await expect(page.getByRole('dialog')).toBeHidden()
	await expect(expand).toBeFocused()
})

for (const route of ['/', '/projects', '/contact']) {
	test(`has no serious accessibility violations on ${route}`, async ({ page }) => {
		await page.goto(route)
		const results = await new AxeBuilder({ page }).analyze()
		const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))
		expect(blocking).toEqual([])
	})
}

test('public health response is minimal', async ({ request }) => {
	const response = await request.get('http://localhost:8181/api/health')
	expect(response.ok()).toBeTruthy()
	expect(await response.json()).toEqual({ status: 'ok', databaseEnabled: true })
})

test('missing project routes render the intentional not-found experience', async ({ page }) => {
	await page.goto('/projects/does-not-exist')

	await expect(page.getByRole('heading', { name: /this case study isn't available/i })).toBeVisible()
	await expect(page.getByRole('link', { name: /back to projects/i })).toBeVisible()
})

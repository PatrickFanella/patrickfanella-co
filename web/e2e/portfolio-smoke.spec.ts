import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('visitor can browse featured work and submit the contact form', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('heading', { name: /i write the api,\s*the interface,\s*and the runbook\./i })).toBeVisible()

	await page.getByRole('link', { name: /^read the case studies$/i }).click()
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

	await page.getByRole('button', { name: /^send message$/i }).click()
	await expect(page.getByRole('status')).toContainText('Thanks. Your note has been saved.')
})

test('production routing, metadata, and legacy redirects are correct', async ({ page, request }) => {
	const archived = await request.get('/projects/subcorp', { maxRedirects: 0 })
	expect(archived.status()).toBe(200)
	const archivedHtml = await archived.text()
	expect(archivedHtml).toContain('noindex,follow')

	const tools = await request.get('/tools', { maxRedirects: 0 })
	expect(tools.status()).toBe(308)
	expect(tools.headers().location).toBe('/projects#tools')

	const legacy = await request.get('/projects/transcript-create', { maxRedirects: 0 })
	expect(legacy.status()).toBe(308)
	expect(legacy.headers().location).toBe('/projects/rekolekt')

	const renamed = await request.get('/projects/discord-spywatcher', { maxRedirects: 0 })
	expect(renamed.status()).toBe(308)
	expect(renamed.headers().location).toBe('/projects/backline')

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
	await expect(page.getByRole('heading', { name: /i write the api,\s*the interface,\s*and the runbook\./i })).toBeInViewport()
	await expect(page.getByRole('link', { name: /^read the case studies$/i })).toBeInViewport()

	await page.goto('/projects')
	await expect(page.getByRole('heading', { name: /^projects$/i })).toBeInViewport()
	await expect(page.getByText(/each project names its delivery status/i)).toBeInViewport()

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

for (const route of ['/', '/projects', '/archive', '/projects/clpr', '/contact']) {
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


test('selected work has six case studies and supports tool-only filter results', async ({ page }) => {
	await page.goto('/projects')
	const caseStudies = page.getByRole('link', { name: /read case study:/i })
	await expect(caseStudies).toHaveCount(6)
	expect(await caseStudies.evaluateAll((links) => links.map((link) => link.getAttribute('aria-label')))).toEqual(['Read case study: Clpr', 'Read case study: HasanAra', 'Read case study: Undertow', 'Read case study: Patchwork', 'Read case study: Tadooer', 'Read case study: Super Productivity MCP'])
	const featured = page.getByRole('region', { name: 'Featured case studies' })
	await expect(featured.getByRole('heading', { level: 3 })).toHaveText(['Clpr', 'HasanAra', 'Undertow'])
	await expect(page.locator('.project-grid').first().getByRole('heading', { level: 3 })).toHaveText(['Clpr', 'HasanAra', 'Undertow'])
	const filter = page.getByRole('combobox', { name: 'Filter by technology' })
	await filter.focus()
	await expect(filter).toBeFocused()
	await filter.selectOption('CalDAV')
	await expect(page.getByRole('heading', { name: 'Tadooer', exact: true })).toBeVisible()
	await expect(caseStudies).toHaveCount(1)
	await filter.selectOption('Ink')
	await expect(page.getByRole('heading', { name: 'Subsets', exact: true })).toBeVisible()
	await expect(caseStudies).toHaveCount(0)
	await page.getByRole('button', { name: 'Clear filter' }).click()
	await expect(caseStudies).toHaveCount(6)
	await page.getByRole('link', { name: 'Read case study: Tadooer' }).click()
	await expect(page.getByRole('heading', { name: 'Tadooer', exact: true })).toBeVisible()
	await expect(page.getByText('Private single-owner use', { exact: true })).toBeVisible()
})

test('project cards align each row, inset their text, and keep actions at the bottom', async ({ page }) => {
	for (const width of [1440, 768, 320]) {
		await page.setViewportSize({ width, height: 900 })
		for (const route of ['/projects', '/archive']) {
			await page.goto(route)
			await expect(page.locator('.project-tile').first()).toBeVisible()
			await page.evaluate(() => document.fonts.ready)
			const grids = await page.locator('.project-grid').evaluateAll((grids) => grids.map((grid) => [...grid.querySelectorAll('.project-tile')].map((card) => {
				const header = card.querySelector('.project-tile-header')!
				const title = header.querySelector('h3')!
				const status = header.querySelector('p')!
				const brand = header.querySelector('.project-brand')!
				const summary = card.querySelector('.project-tile-summary')!
				const actions = card.querySelector('.project-tile-links')!
				const bounds = card.getBoundingClientRect()
				return {
					title: title.textContent,
					top: bounds.top,
					titleTop: title.getBoundingClientRect().top,
					statusTop: status.getBoundingClientRect().top,
					statusUnderTitle: status.getBoundingClientRect().top >= title.getBoundingClientRect().bottom,
					statusLeft: status.getBoundingClientRect().left,
					titleLeft: title.getBoundingClientRect().left,
					summaryTop: summary.getBoundingClientRect().top,
					actionsTop: actions.getBoundingClientRect().top,
					bottomInset: bounds.bottom - actions.getBoundingClientRect().bottom,
					textInset: header.getBoundingClientRect().left - bounds.left,
					brandWidth: brand.getBoundingClientRect().width,
					identity: Boolean(brand.querySelector('img, .project-monogram')),
					whiteSpace: getComputedStyle(title).whiteSpace,
					textOverflow: getComputedStyle(title).textOverflow,
				}
			})))
			for (const cards of grids) {
				for (const card of cards) {
					expect(card.identity, `${card.title} at ${width}px`).toBe(true)
					expect(card.brandWidth).toBe(48)
					expect(card.whiteSpace).toBe('nowrap')
					expect(card.textOverflow).toBe('ellipsis')
					expect(card.statusUnderTitle).toBe(true)
					expect(card.statusLeft).toBe(card.titleLeft)
					expect(card.textInset).toBeGreaterThanOrEqual(24)
					expect(card.bottomInset).toBeCloseTo(2, 0)
					const row = cards.filter((sibling) => Math.abs(sibling.top - card.top) < 1)
					for (const field of ['titleTop', 'statusTop', 'summaryTop', 'actionsTop'] as const) {
						const positions = row.map((sibling) => sibling[field])
						expect(Math.max(...positions) - Math.min(...positions), `${field} on ${route} at ${width}px`).toBeLessThan(1)
					}
				}
			}
		}
	}
})

test('recruiter routes fit a narrow screen without horizontal scrolling', async ({ page }) => {
	for (const width of [320, 768]) {
	await page.setViewportSize({ width, height: 780 })
	for (const route of ['/', '/projects', '/archive', '/projects/tadooer', '/projects/super-productivity-mcp', '/resume', '/contact']) {
		await page.goto(route)
		await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
		await expect(page.getByRole('status').filter({ hasText: /loading/i })).toHaveCount(0)
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} at ${width}px`).toBe(true)
	}
	}
})


test('project content is deployed with the web artifact and remains available without project API requests', async ({ page, request }) => {
	const catalogResponse = await request.get('/content/projects.json')
	expect(catalogResponse.ok()).toBe(true)
	expect(catalogResponse.headers()['cache-control']).toContain('no-store')
	const { items } = await catalogResponse.json()
	expect(items.filter((project: { featured: boolean }) => project.featured).map((project: { slug: string }) => project.slug)).toEqual(['clpr', 'hasanara', 'undertow'])
	for (const project of items) {
		expect(project.classification).toMatch(/^(flagship|experiment|archive)$/)
		expect(project.deliveryStatus).toBeTruthy()
		expect(project.periodLabel).toBeTruthy()
	}
	await page.route('**/api/**', (route) => route.abort())
	await page.goto('/')
	await expect(page.getByRole('link', { name: /read case study:/i })).toHaveCount(3)
	await page.goto('/projects')
	await expect(page.getByRole('link', { name: /read case study:/i })).toHaveCount(6)
	await page.getByRole('link', { name: 'Read case study: Tadooer' }).click()
	await expect(page.getByRole('heading', { name: 'Tadooer', exact: true })).toBeVisible()
})


test('archive navigation exposes thumbnails and searchable project records', async ({ page }) => {
	await page.goto('/')
	await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Archive', exact: true }).click()
	await expect(page.getByRole('heading', { level: 1, name: 'Archive' })).toBeVisible()
	await expect(page.locator('.archive-thumbnail img').first()).toBeVisible()
	await page.getByRole('searchbox', { name: 'Find a project' }).fill('monitor')
	await expect(page.getByRole('heading', { name: /monitor/i })).toBeVisible()
	await expect(page.locator('.archive-tile')).toHaveCount(1)
})

test('case-study overview uses compact facts instead of a tall sidebar', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 900 })
	await page.goto('/projects/clpr')
	await expect(page.locator('.case-facts')).toBeVisible()
	await expect(page.getByRole('complementary', { name: 'Project overview' })).toHaveCount(0)
	await expect(page.locator('.case-intro')).toHaveCSS('display', 'block')
	const media = page.locator('.case-intro + .case-story')
	await expect(media).toBeVisible()
	await expect(page.locator('.case-intro img')).toBeVisible()
})

test('the requested project collection is visible and removed projects return 404', async ({ page, request }) => {
	const required = ['clpr', 'hasanara', 'undertow', 'chatty-cat', 'commons', 'headcount', 'left-field', 'arkhiv', 'rekolekt', 'tadooer', 'subsets', 'patstack', 'obsidian-plugin-metronome-tuner', 'super-productivity-mcp', 'ytclip', 'twitchdl', 'patchwork', 'clustr-galaxy', 'the-common-house', 'backline', 'tmux-popups', 'prichal', 'pirs', 'subcult-os', 'kork']
	const removed = ['subcults', 'redstring', 'echo-trails', 'nearbody', 'one-block-cinema', 'pocket-civilization', 'vod-tender', 'magic-playlists', 'internet-id', 'soundhash', 'paqr', 'galdr', 'llama-line', 'artemis', 'clustr']
	const { items } = await (await request.get('/content/projects.json')).json()
	expect(items.filter((project: { selected: boolean }) => project.selected).map((project: { slug: string }) => project.slug).sort()).toEqual(required.sort())
	await page.goto('/projects')
	await expect(page.getByRole('status')).toContainText('25 projects')
	for (const project of items.filter((project: { selected: boolean }) => project.selected)) {
		await expect(page.getByRole('heading', { level: 3, name: project.title, exact: true })).toHaveCount(1)
		expect(project.media.some((media: { src: string }) => media.src.includes('/diagrams/'))).toBe(true)
	}
	for (const slug of removed) {
		expect(items.some((project: { slug: string }) => project.slug === slug)).toBe(false)
		expect((await request.get(`/projects/${slug}`, { maxRedirects: 0 })).status(), slug).toBe(404)
	}
	const screenshots = items.flatMap((project: { media: { src: string; capturedAt?: string }[] }) => project.media).filter((media: { src: string }) => media.src.includes('/screenshots/'))
	expect(screenshots).toHaveLength(20)
	for (const media of screenshots) {
		expect(media.capturedAt).toMatch(/^2026-11-05T/)
		expect(media.src).toContain('/2026-11-05-')
	}
})

test('connected projects link both ways and Arkhiv exposes its collection frontends', async ({ page }) => {
	await page.goto('/projects/hasanara')
	await page.getByRole('link', { name: 'Rekolekt', exact: true }).click()
	await expect(page).toHaveURL(/\/projects\/rekolekt$/)
	await expect(page.getByText(/it ships no web pages/i)).toBeVisible()
	await page.getByRole('link', { name: 'HasanAra', exact: true }).click()
	await expect(page).toHaveURL(/\/projects\/hasanara$/)
	await page.goto('/projects/subsets')
	await page.getByRole('link', { name: 'Patstack', exact: true }).click()
	await expect(page).toHaveURL(/\/projects\/patstack$/)
	await page.getByRole('link', { name: 'Subsets', exact: true }).click()
	await expect(page).toHaveURL(/\/projects\/subsets$/)
	await page.goto('/projects/arkhiv')
	await expect(page.locator('#collections article')).toHaveCount(6)
	for (const title of ['Anarchist Archive', 'Riot Grrrl Zine Archive', 'Dedhed', 'Lineage', 'Bill Nye TV', 'Democracy Now! TV']) {
		await expect(page.locator('#collections').getByRole('heading', { name: title, exact: true })).toBeVisible()
	}
	await page.goto('/projects/obsidian-plugin-metronome-tuner')
	await expect(page.getByRole('heading', { name: 'Metronome + Tuner', exact: true })).toBeVisible()
})

test('the source button separates its icon from the text on narrow and wide screens', async ({ page }) => {
	for (const width of [320, 1280]) {
		await page.setViewportSize({ width, height: 900 })
		await page.goto('/projects/clpr')
		const source = page.getByRole('link', { name: 'View source', exact: true })
		await expect(source).toBeVisible()
		const gap = await source.evaluate((element) => {
			const text = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())!
			const range = document.createRange()
			range.selectNodeContents(text)
			return range.getBoundingClientRect().left - element.querySelector('svg')!.getBoundingClientRect().right
		})
		expect(gap, `visible icon/text gap at ${width}px`).toBeGreaterThanOrEqual(7.5)
	}
})

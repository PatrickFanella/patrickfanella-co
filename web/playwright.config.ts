import { defineConfig, devices } from '@playwright/test'
import { readFileSync } from 'node:fs'

function dockerHostForCI() {
	if (!process.env.CI) return 'localhost'

	try {
		const defaultRoute = readFileSync('/proc/net/route', 'utf8')
			.split(/\r?\n/)
			.map((line) => line.trim().split(/\s+/))
			.find((fields) => fields[1] === '00000000')
		const gateway = defaultRoute?.[2]
		if (!gateway || gateway.length !== 8) return 'localhost'

		return gateway
			.match(/../g)!
			.reverse()
			.map((octet) => Number.parseInt(octet, 16))
			.join('.')
	} catch {
		return 'localhost'
	}
}

const webHost = process.env.E2E_WEB_HOST || dockerHostForCI()
const webPort = process.env.E2E_WEB_PORT || '4173'
const apiPort = process.env.E2E_API_PORT || '8181'
const webBaseURL = `http://${webHost}:${webPort}`

export default defineConfig({
	testDir: './e2e',
	timeout: 60_000,
	fullyParallel: false,
	retries: process.env.CI ? 2 : 0,
	reporter: 'list',
	globalSetup: './e2e/global-setup.ts',
	globalTeardown: './e2e/global-teardown.ts',
	use: {
		baseURL: webBaseURL,
		headless: true,
		...(process.env.E2E_CHROMIUM_EXECUTABLE
			? { launchOptions: { executablePath: process.env.E2E_CHROMIUM_EXECUTABLE } }
			: {}),
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
	},
	webServer: [
		{
			name: 'API',
			command: `API_PORT=${apiPort} CORS_ORIGIN=${webBaseURL} bash ./scripts/start-api-preview.sh`,
			url: `http://localhost:${apiPort}/api/health`,
			timeout: 120_000,
			reuseExistingServer: false,
		},
		{
			name: 'Production Nginx web',
			command: `E2E_API_PORT=${apiPort} E2E_WEB_PORT=${webPort} bash ./scripts/start-e2e-web.sh`,
			url: `${webBaseURL}/healthz`,
			timeout: 120_000,
			reuseExistingServer: false,
		},
	],
	projects: [
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome'],
			},
		},
	],
})

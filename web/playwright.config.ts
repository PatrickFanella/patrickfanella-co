import { defineConfig, devices } from '@playwright/test'

// In CI the web container joins the job container's network namespace
// (E2E_DOCKER_NETWORK), so it is reachable on localhost there as well.
const webHost = process.env.E2E_WEB_HOST || 'localhost'
const webBaseURL = `http://${webHost}:4173`

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
			// Playwright starts web servers before global setup. Start PostgreSQL
			// first so the API does not begin in degraded mode and serve empty data.
			command: `bash ./scripts/start-postgres.sh && CORS_ORIGIN=${webBaseURL} bash ./scripts/start-api-preview.sh`,
			url: 'http://localhost:8181/api/health',
			timeout: 120_000,
			reuseExistingServer: false,
		},
		{
			name: 'Production Nginx web',
			command: 'bash ./scripts/start-e2e-web.sh',
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

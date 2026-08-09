import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	timeout: 60_000,
	fullyParallel: false,
	retries: process.env.CI ? 2 : 0,
	reporter: 'list',
	globalSetup: './e2e/global-setup.ts',
	globalTeardown: './e2e/global-teardown.ts',
	use: {
		baseURL: 'http://localhost:4173',
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
			command: 'CORS_ORIGIN=http://localhost:4173 bash ./scripts/start-api-preview.sh',
			url: 'http://localhost:8181/api/health',
			timeout: 120_000,
			reuseExistingServer: false,
		},
		{
			name: 'Production Nginx web',
			command: 'bash ./scripts/start-e2e-web.sh',
			url: 'http://localhost:4173/healthz',
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

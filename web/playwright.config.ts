import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	timeout: 60_000,
	fullyParallel: false,
	retries: process.env.CI ? 2 : 0,
	reporter: 'list',
	globalSetup: './e2e/global-setup.ts',
	use: {
		baseURL: 'http://localhost:5173',
		headless: true,
		screenshot: 'only-on-failure',
		trace: 'on-first-retry',
	},
	webServer: [
		{
			name: 'API',
			command: 'cd ../api && go run ./cmd/server',
			url: 'http://localhost:8080/api/health',
			timeout: 120_000,
			reuseExistingServer: false,
		},
		{
			name: 'Web',
			command: 'npm run dev -- --host localhost --port 5173',
			url: 'http://localhost:5173',
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

import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../scripts')

export default function globalTeardown() {
	const suffix = process.env.E2E_RUN_ID ? `-${process.env.E2E_RUN_ID}` : ''
	try {
		execFileSync('docker', ['rm', '-f', `patrickfanella-portfolio-e2e-web${suffix}`], { stdio: 'ignore' })
	} catch {
		// The web-server wrapper may already have removed the disposable container.
	}
	// Removes the CI-only PostgreSQL container; a local Compose database is kept.
	execFileSync('bash', [path.join(scriptsDir, 'start-postgres.sh'), 'stop'], { stdio: 'inherit' })
}

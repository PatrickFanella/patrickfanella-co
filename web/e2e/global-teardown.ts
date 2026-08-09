import { execFileSync } from 'node:child_process'

export default function globalTeardown() {
	try {
		execFileSync('docker', ['rm', '-f', 'patrickfanella-portfolio-e2e-web'], { stdio: 'ignore' })
	} catch {
		// The web-server wrapper may already have removed the disposable container.
	}
}

import { execSync } from 'node:child_process'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '../..')
const apiRoot = path.join(repoRoot, 'api')

function waitForPort(port: number, host: string, timeoutMs: number) {
	return new Promise<void>((resolve, reject) => {
		const startedAt = Date.now()

		const tryConnect = () => {
			const socket = net.createConnection({ host, port })

			socket.on('connect', () => {
				socket.end()
				resolve()
			})

			socket.on('error', () => {
				socket.destroy()

				if (Date.now() - startedAt >= timeoutMs) {
					reject(new Error(`Timed out waiting for ${host}:${port}`))
					return
				}

				setTimeout(tryConnect, 1_000)
			})
		}

		tryConnect()
	})
}

export default async function globalSetup() {
	try {
		execSync('docker compose up -d postgres', {
			cwd: repoRoot,
			stdio: 'inherit',
		})
	} catch (error) {
		await waitForPort(5432, '127.0.0.1', 5_000).catch(() => {
			throw error
		})
	}

	await waitForPort(5432, '127.0.0.1', 60_000)

	execSync('go run ./cmd/migrate', {
		cwd: apiRoot,
		stdio: 'inherit',
		env: process.env,
	})

	execSync('go run ./cmd/seed', {
		cwd: apiRoot,
		stdio: 'inherit',
		env: process.env,
	})
}

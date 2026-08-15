import { execFileSync, execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '../..')
const apiRoot = path.join(repoRoot, 'api')

function readLocalEnv(): Record<string, string> {
	try {
		const envFile = readFileSync(path.join(repoRoot, '.env'), 'utf8')
		return Object.fromEntries(envFile.split(/\r?\n/).filter((line) => line && !line.startsWith('#') && line.includes('=')).map((line) => {
			const separator = line.indexOf('=')
			return [line.slice(0, separator), line.slice(separator + 1)]
		})) as Record<string, string>
	} catch {
		return {}
	}
}

async function waitForPostgresReady(user: string, database: string, timeoutMs: number) {
	const startedAt = Date.now()
	while (Date.now() - startedAt < timeoutMs) {
		try {
			execFileSync('docker', ['compose', 'exec', '-T', 'postgres', 'pg_isready', '-U', user, '-d', database], { cwd: repoRoot, stdio: 'ignore' })
			return
		} catch {
			await new Promise((resolve) => setTimeout(resolve, 1_000))
		}
	}
	throw new Error('Timed out waiting for PostgreSQL readiness')
}

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
	const localEnv = readLocalEnv()
	const postgresPort = Number(process.env.POSTGRES_HOST_PORT || localEnv.POSTGRES_HOST_PORT || 5432)
	const postgresUser = process.env.POSTGRES_USER || localEnv.POSTGRES_USER || 'postgres'
	const postgresPassword = process.env.POSTGRES_PASSWORD || localEnv.POSTGRES_PASSWORD || 'postgres'
	const postgresDatabase = process.env.POSTGRES_DB || localEnv.POSTGRES_DB || 'patrickfanella'
	process.env.DATABASE_URL = `postgres://${encodeURIComponent(postgresUser)}:${encodeURIComponent(postgresPassword)}@127.0.0.1:${postgresPort}/${encodeURIComponent(postgresDatabase)}?sslmode=disable`
	try {
		execSync('docker compose up -d postgres', {
			cwd: repoRoot,
			stdio: 'inherit',
		})
	} catch (error) {
		await waitForPort(postgresPort, '127.0.0.1', 5_000).catch(() => {
			throw error
		})
	}

	await waitForPort(postgresPort, '127.0.0.1', 60_000)
	await waitForPostgresReady(postgresUser, postgresDatabase, 60_000)

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

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(webRoot, '..')
const envPath = path.join(repoRoot, '.env')
const seedPath = path.join(repoRoot, 'db', 'seed', 'portfolio.json')
const publicDir = path.join(webRoot, 'public')

function readEnvValue(source, key) {
	const line = source
		.split(/\r?\n/)
		.find((entry) => entry.trim().startsWith(`${key}=`))

	return line ? line.slice(key.length + 1).trim() : ''
}

async function resolveSiteUrl() {
	const envSiteUrl = (process.env.VITE_SITE_URL || '').trim()
	if (envSiteUrl) {
		return envSiteUrl.replace(/\/$/, '')
	}

	try {
		const envFile = await readFile(envPath, 'utf8')
		return (readEnvValue(envFile, 'VITE_SITE_URL') || 'https://patrickfanella.co').replace(/\/$/, '')
	} catch {
		return 'https://patrickfanella.co'
	}
}

async function main() {
	const siteUrl = await resolveSiteUrl()
	const portfolio = JSON.parse(await readFile(seedPath, 'utf8'))
	const routes = ['/', '/projects', '/contact', ...portfolio.projects.map((project) => `/projects/${project.slug}`)]
	const uniqueRoutes = [...new Set(routes)]

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueRoutes
		.map((route) => `  <url><loc>${siteUrl}${route}</loc></url>`)
		.join('\n')}\n</urlset>\n`
	const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

	await mkdir(publicDir, { recursive: true })
	await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap)
	await writeFile(path.join(publicDir, 'robots.txt'), robots)
}

main().catch((error) => {
	console.error('Failed to generate sitemap assets:', error)
	process.exitCode = 1
})

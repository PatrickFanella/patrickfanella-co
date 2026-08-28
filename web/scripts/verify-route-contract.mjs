import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(webRoot, 'dist')

async function main() {
  const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8')
  const locations = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((match) => match[1] || '/')
  const failures = []

  for (const route of locations) {
    const output = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route.replace(/^\//, ''), 'index.html')
    try {
      await access(output)
      const html = await readFile(output, 'utf8')
      if (html.includes('noindex')) failures.push(`${route} is in the sitemap but marked noindex`)
    } catch {
      failures.push(`${route} has no generated route document`)
    }
  }

  for (const route of ['/archive', '/projects/internet-id']) {
    const html = await readFile(path.join(distDir, route.replace(/^\//, ''), 'index.html'), 'utf8')
    if (!html.includes('noindex,follow')) failures.push(`${route} must remain noindex`)
    if (locations.includes(route)) failures.push(`${route} must not be in the sitemap`)
  }

  const homeHtml = await readFile(path.join(distDir, 'index.html'), 'utf8')
  const homeFocusAreas = ['Backend systems', 'Accessible product interfaces', 'Testing and deployment', 'Production operations']
  if (!homeHtml.includes(`"knowsAbout":${JSON.stringify(homeFocusAreas)}`)) {
    failures.push('home Person knowsAbout must match the rendered focus areas')
  }

  if (homeHtml.includes(`| Patrick Fanella | Patrick Fanella`)) {
    failures.push('home title must include the site name once')
  }

  if (failures.length > 0) throw new Error(`Route contract failed:\n- ${failures.join('\n- ')}`)
  console.log(`Route contract verified: ${locations.length} indexed routes, archive routes are noindex.`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})

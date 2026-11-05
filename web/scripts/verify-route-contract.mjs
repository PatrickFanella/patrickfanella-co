import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(webRoot, 'dist')

async function main() {
  const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8')
  const locations = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((match) => match[1] || '/')
  const failures = []
  const expectedCatalog = await readFile(path.join(webRoot, 'public/content/projects.json'), 'utf8')
  const publishedCatalog = await readFile(path.join(distDir, 'content/projects.json'), 'utf8')
  if (publishedCatalog !== expectedCatalog) failures.push('web artifact must contain the prepared project catalog')

  const { items } = JSON.parse(publishedCatalog)
  const assets = new Set(['/assets/brands/patrick-eff.svg'])
  for (const project of items) {
    for (const asset of [project.logoUrl, project.thumbnailUrl, ...(project.collections || []).flatMap((collection) => [collection.logoUrl, collection.thumbnailUrl]), ...project.media.flatMap((media) => [media.src, ...(media.srcSet || '').split(',').map((source) => source.trim().split(/\s+/)[0])])]) {
      if (asset?.startsWith('/assets/')) assets.add(asset)
    }
    for (const related of project.relatedProjects || []) {
      if (!items.some((item) => item.slug === related.slug)) failures.push(`${project.slug} links to missing related project ${related.slug}`)
    }
    try {
      await access(path.join(distDir, 'projects', project.slug, 'index.html'))
    } catch {
      failures.push(`${project.slug} has no generated detail document`)
    }
  }
  for (const asset of assets) {
    try {
      await access(path.join(distDir, asset.slice(1)))
    } catch {
      failures.push(`missing published project asset: ${asset}`)
    }
  }

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

  for (const route of ['/archive', '/projects/subcorp']) {
    const html = await readFile(path.join(distDir, route.replace(/^\//, ''), 'index.html'), 'utf8')
    if (!html.includes('noindex,follow')) failures.push(`${route} must remain noindex`)
    if (locations.includes(route)) failures.push(`${route} must not be in the sitemap`)
  }

  const removed = ['subcults', 'redstring', 'echo-trails', 'nearbody', 'one-block-cinema', 'pocket-civilization', 'vod-tender', 'magic-playlists', 'internet-id', 'soundhash', 'paqr', 'galdr', 'llama-line', 'artemis', 'clustr']
  for (const slug of removed) {
    if (items.some((project) => project.slug === slug)) failures.push(`removed project ${slug} remains in the catalog`)
    try {
      await access(path.join(distDir, 'projects', slug, 'index.html'))
      failures.push(`removed project ${slug} still has a route document`)
    } catch { /* Removed project routes intentionally have no output. */ }
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

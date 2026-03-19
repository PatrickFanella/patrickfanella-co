import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const webRoot = path.resolve(__dirname, '..')
const repoRoot = path.resolve(webRoot, '..')
const distDir = path.join(webRoot, 'dist')
const distIndexPath = path.join(distDir, 'index.html')
const envPath = path.join(repoRoot, '.env')
const seedPath = path.join(repoRoot, 'db', 'seed', 'portfolio.json')

const siteName = 'Patrick Fanella'
const defaultDescription =
  'Project-first portfolio for Patrick Fanella covering Go APIs, React interfaces, PostgreSQL, AI pipelines, and production systems.'
const fallbackImagePath = '/assets/projects/project-fallback.svg'

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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function toAbsoluteUrl(siteUrl, value) {
  if (!value) {
    return undefined
  }

  return new URL(value, `${siteUrl}/`).toString()
}

function buildStructuredDataScripts(entries) {
  return entries
    .map(
      (entry) =>
        `<script type="application/ld+json">${JSON.stringify(entry).replaceAll('</script>', '<\\/script>')}</script>`,
    )
    .join('\n    ')
}

function createHtmlDocument({
  assetTags,
  canonicalUrl,
  description,
  imageAlt,
  imageUrl,
  ogType = 'website',
  robots = 'index,follow',
  structuredData = [],
  title,
  url,
}) {
  const structuredScripts = structuredData.length > 0 ? `\n    ${buildStructuredDataScripts(structuredData)}` : ''
  const canonicalTag = canonicalUrl
    ? `\n    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
    : ''
  const ogUrlTag = url ? `\n    <meta property="og:url" content="${escapeHtml(url)}" />` : ''
  const ogImageTag = imageUrl
    ? `\n    <meta property="og:image" content="${escapeHtml(imageUrl)}" />`
    : ''
  const ogImageAltTag = imageUrl && imageAlt
    ? `\n    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`
    : ''
  const twitterImageTag = imageUrl
    ? `\n    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`
    : ''
  const twitterImageAltTag = imageUrl && imageAlt
    ? `\n    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />`
    : ''

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="${escapeHtml(robots)}" />
    <meta name="theme-color" content="#282a36" />
    <meta property="og:type" content="${escapeHtml(ogType)}" />
    <meta property="og:site_name" content="${escapeHtml(siteName)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />${ogUrlTag}${ogImageTag}${ogImageAltTag}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />${twitterImageTag}${twitterImageAltTag}${canonicalTag}${structuredScripts}
    ${assetTags}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
}

function extractAssetTags(html) {
  const stylesheetTags = [...html.matchAll(/<link rel="stylesheet"[^>]*>/g)].map((match) => match[0])
  const scriptTags = [...html.matchAll(/<script type="module"[^>]*><\/script>/g)].map((match) => match[0])

  return [...stylesheetTags, ...scriptTags].join('\n    ')
}

function ensureArray(value) {
  return Array.isArray(value) ? value : []
}

function getHomePageDefinition(siteUrl, assetTags) {
  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl: `${siteUrl}/`,
      description: defaultDescription,
      imageUrl: toAbsoluteUrl(siteUrl, fallbackImagePath),
      title: `${siteName} | Full Stack Developer`,
      url: `${siteUrl}/`,
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          jobTitle: 'Full Stack Developer',
          knowsAbout: [
            'Go / Backend Architecture',
            'React / TypeScript Interfaces',
            'AI, Search, and Data Pipelines',
            'Infrastructure / DevOps',
          ],
          name: siteName,
          sameAs: ['https://github.com/PatrickFanella'],
          url: siteUrl,
        },
      ],
    }),
    outputPath: path.join(distDir, 'index.html'),
  }
}

function getProjectsPageDefinition(siteUrl, assetTags) {
  const canonicalUrl = `${siteUrl}/projects`
  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl,
      description: "Browse Patrick Fanella's production case studies by stack, problem domain, and shipped system design.",
      imageUrl: toAbsoluteUrl(siteUrl, fallbackImagePath),
      title: `Projects | ${siteName}`,
      url: canonicalUrl,
    }),
    outputPath: path.join(distDir, 'projects', 'index.html'),
  }
}

function getContactPageDefinition(siteUrl, assetTags) {
  const canonicalUrl = `${siteUrl}/contact`
  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl,
      description: 'Start a conversation with Patrick Fanella about backend, full stack, AI-driven, or real-time product work.',
      imageUrl: toAbsoluteUrl(siteUrl, fallbackImagePath),
      title: `Contact | ${siteName}`,
      url: canonicalUrl,
    }),
    outputPath: path.join(distDir, 'contact', 'index.html'),
  }
}

function getProjectPageDefinition(siteUrl, assetTags, project) {
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`
  const imagePath = project.media?.[0]?.src || fallbackImagePath
  const imageAlt = project.media?.[0]?.alt || `${project.title} supporting visual`

  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl,
      description: project.summary,
      imageAlt,
      imageUrl: toAbsoluteUrl(siteUrl, imagePath),
      ogType: 'article',
      title: `${project.title} | ${siteName}`,
      url: canonicalUrl,
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          author: {
            '@type': 'Person',
            name: siteName,
          },
          description: project.summary,
          headline: project.title,
          image: imagePath ? [toAbsoluteUrl(siteUrl, imagePath)] : undefined,
          keywords: ensureArray(project.tags).join(', '),
          name: project.title,
          url: canonicalUrl,
        },
      ],
    }),
    outputPath: path.join(distDir, 'projects', project.slug, 'index.html'),
  }
}

function getNotFoundPageDefinition(assetTags) {
  return {
    html: createHtmlDocument({
      assetTags,
      description: 'The requested page could not be found.',
      imageUrl: fallbackImagePath,
      robots: 'noindex,follow',
      title: `Page not found | ${siteName}`,
    }),
    outputPath: path.join(distDir, '404.html'),
  }
}

async function writePage({ outputPath, html }) {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html)
}

async function main() {
  const siteUrl = await resolveSiteUrl()
  const distIndex = await readFile(distIndexPath, 'utf8')
  const portfolio = JSON.parse(await readFile(seedPath, 'utf8'))
  const assetTags = extractAssetTags(distIndex)

  const pages = [
    getHomePageDefinition(siteUrl, assetTags),
    getProjectsPageDefinition(siteUrl, assetTags),
    getContactPageDefinition(siteUrl, assetTags),
    getNotFoundPageDefinition(assetTags),
    ...portfolio.projects.map((project) => getProjectPageDefinition(siteUrl, assetTags, project)),
  ]

  await Promise.all(pages.map(writePage))
}

main().catch((error) => {
  console.error('Failed to generate route HTML files:', error)
  process.exitCode = 1
})

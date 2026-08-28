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
const defaultTitle = 'Patrick Fanella | Senior Full-Stack and Backend Engineer'
const defaultDescription =
  'Patrick Fanella builds Go and Python services, PostgreSQL data systems, and accessible React interfaces.'
const defaultImageAlt = 'Patrick Fanella portfolio preview'
const resumeDescription = "Download Patrick Fanella's one-page resume for senior full-stack and backend engineering roles."
const fallbackImagePath = '/assets/social/patrick-fanella-portfolio-1200x630.png'
const bespokeSocialImageSlugs = new Set(['clpr', 'patchwork', 'hasanara'])

const flagshipSeoTitles = {
  clpr: 'Clpr case study | Go, React and hybrid search',
  patchwork: 'Patchwork case study | AT Protocol and location privacy',
  hasanara: 'HasanAra case study | GPU transcription and search',
  clustr: 'Clustr case study | Graph analysis and Unity client',
  subcults: 'Subcults case study | Go, maps and community infrastructure',
  switchyard: 'Switchyard case study | Go, React and workflow routing',
  'subcult-os': 'Subcult-OS case study | Go, React and event operations',
}

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
  imageAlt = defaultImageAlt,
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

function getHomePageDefinition(siteUrl, assetTags) {
  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl: `${siteUrl}/`,
      description: defaultDescription,
      imageAlt: defaultImageAlt,
      imageUrl: toAbsoluteUrl(siteUrl, fallbackImagePath),
      title: defaultTitle,
      url: `${siteUrl}/`,
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          jobTitle: 'Senior Full-Stack and Backend Engineer',
          knowsAbout: [
            'Backend systems',
            'Accessible product interfaces',
            'Testing and deployment',
            'Production operations',
          ],
          name: siteName,
          email: 'mailto:fanella.patrick@gmail.com',
          image: toAbsoluteUrl(siteUrl, fallbackImagePath),
          homeLocation: {
            '@type': 'Place',
            name: 'Chicago, Illinois',
          },
          sameAs: [
            'https://github.com/PatrickFanella',
            'https://git.subcult.tv/PatrickFanella',
            'https://linkedin.com/in/patrick-fanella',
          ],
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
      description: 'Case studies and developer tools by senior full-stack and backend engineer Patrick Fanella.',
      imageUrl: toAbsoluteUrl(siteUrl, fallbackImagePath),
      title: `Projects | Senior full-stack and backend engineer | ${siteName}`,
      url: canonicalUrl,
    }),
    outputPath: path.join(distDir, 'projects', 'index.html'),
  }
}

function getArchivePageDefinition(siteUrl, assetTags) {
  const canonicalUrl = `${siteUrl}/archive`
  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl,
      description: 'Additional projects by Patrick Fanella, organized by area.',
      imageUrl: toAbsoluteUrl(siteUrl, fallbackImagePath),
      robots: 'noindex,follow',
      title: `Additional projects | ${siteName}`,
      url: canonicalUrl,
    }),
    outputPath: path.join(distDir, 'archive', 'index.html'),
  }
}

function getResumePageDefinition(siteUrl, assetTags) {
  const canonicalUrl = `${siteUrl}/resume`
  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl,
      description: resumeDescription,
      imageUrl: toAbsoluteUrl(siteUrl, fallbackImagePath),
      title: `Resume | Senior full-stack and backend engineer | ${siteName}`,
      url: canonicalUrl,
    }),
    outputPath: path.join(distDir, 'resume', 'index.html'),
  }
}

function getContactPageDefinition(siteUrl, assetTags) {
  const canonicalUrl = `${siteUrl}/contact`
  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl,
      description: 'Contact Patrick Fanella about senior full-stack or backend engineering roles in Chicago or remote.',
      imageUrl: toAbsoluteUrl(siteUrl, fallbackImagePath),
      title: `Contact | Senior full-stack and backend engineer | ${siteName}`,
      url: canonicalUrl,
    }),
    outputPath: path.join(distDir, 'contact', 'index.html'),
  }
}

function getProjectPageDefinition(siteUrl, assetTags, project) {
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`
  const imagePath = bespokeSocialImageSlugs.has(project.slug)
    ? `/assets/social/${project.slug}-1200x630.png`
    : fallbackImagePath
  const imageAlt = `${project.title} case study by Patrick Fanella`
  const pageTitle = `${flagshipSeoTitles[project.slug] || project.title.replaceAll(' \u2014 ', ': ')} | ${siteName}`

  return {
    html: createHtmlDocument({
      assetTags,
      canonicalUrl,
      description: project.summary,
      imageAlt,
      imageUrl: toAbsoluteUrl(siteUrl, imagePath),
      ogType: 'article',
      robots: project.classification === 'flagship' ? 'index,follow' : 'noindex,follow',
      title: pageTitle,
      url: canonicalUrl,
      structuredData: [
        {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          author: {
            '@type': 'Person',
            name: siteName,
          },
          datePublished: project.year ? String(project.year) : undefined,
          description: project.summary,
          headline: project.title,
          image: imagePath ? [toAbsoluteUrl(siteUrl, imagePath)] : undefined,
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
    getArchivePageDefinition(siteUrl, assetTags),
    getResumePageDefinition(siteUrl, assetTags),
    getContactPageDefinition(siteUrl, assetTags),
    getNotFoundPageDefinition(assetTags),
    ...portfolio.projects
      .filter((project) => (project.kind || 'case-study') !== 'tool')
      .map((project) => getProjectPageDefinition(siteUrl, assetTags, project)),
  ]

  await Promise.all(pages.map(writePage))
}

main().catch((error) => {
  console.error('Failed to generate route HTML files:', error)
  process.exitCode = 1
})

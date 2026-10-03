import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outArg = process.argv.indexOf('--out')
const outputDir = outArg > -1 && process.argv[outArg + 1]
  ? path.resolve(process.argv[outArg + 1])
  : path.join(webRoot, 'public', 'assets', 'social')

// The committed cards were drawn with exactly these faces. rsvg-convert picks
// fonts through fontconfig, so a host alias or a newly installed family changes
// the output without any error. Each face is located by its real family name
// and rendered through a private fontconfig that contains nothing else.
const fonts = {
  title: { family: 'Liberation Sans', style: 'Bold' },
  detail: { family: 'Inter', variable: true },
  monoBold: { family: 'JetBrainsMono Nerd Font', style: 'Bold' },
  mono: { family: 'JetBrainsMono Nerd Font', style: 'Regular' },
}

const seedPath = path.resolve(webRoot, '..', 'db', 'seed', 'portfolio.json')

// Keep in step with the <h1> in src/pages/HomePage.tsx.
const homeHeadline = 'I write the API, the interface, and the runbook.'

// Project cards exist for the slugs in bespokeSocialImageSlugs
// (generate-route-html.mjs and ProjectDetailPage.tsx).
const projectCards = [
  { slug: 'clpr', eyebrow: 'CASE STUDY / PRODUCTION', accent: '#50fa7b' },
  { slug: 'patchwork', eyebrow: 'CASE STUDY / PRE-ALPHA', accent: '#8be9fd' },
  { slug: 'hasanara', eyebrow: 'CASE STUDY / ACTIVE DEVELOPMENT', accent: '#ff79c6' },
]

const maxDetailLineLength = 66

function firstSentence(text) {
  return text.split(/(?<=\.)\s+/)[0]
}

// One line when it fits; otherwise the two-line break with the most even halves.
function wrapDetail(text) {
  if (text.length <= maxDetailLineLength) return [text]
  const words = text.split(' ')
  let best = null
  for (let index = 1; index < words.length; index += 1) {
    const lines = [words.slice(0, index).join(' '), words.slice(index).join(' ')]
    const longest = Math.max(lines[0].length, lines[1].length)
    if (!best || longest < best.longest) best = { lines, longest }
  }
  if (!best || best.longest > maxDetailLineLength) {
    throw new Error(`Card detail does not fit two lines of ${maxDetailLineLength} characters: ${text}`)
  }
  return best.lines
}

async function loadCards() {
  const { projects } = JSON.parse(await readFile(seedPath, 'utf8'))
  return [
    { file: 'patrick-fanella-portfolio-1200x630.png', eyebrow: 'SENIOR FULL-STACK / BACKEND', title: 'PATRICK FANELLA', detail: homeHeadline, accent: '#50fa7b' },
    ...projectCards.map(({ slug, eyebrow, accent }) => {
      const project = projects.find((candidate) => candidate.slug === slug)
      if (!project) throw new Error(`No project with slug ${slug} in ${seedPath}`)
      return { file: `${slug}-1200x630.png`, eyebrow, title: project.title.toUpperCase(), detail: firstSentence(project.summary), accent }
    }),
  ]
}

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function render(card) {
  const detail = wrapDetail(card.detail)
    .map((line, index) => `<text x="68" y="${414 + index * 46}" fill="#d7d7eb" font-family="${fonts.detail.family}" font-size="34" font-weight="500">${escapeXml(line)}</text>`)
    .join('\n  ')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#805bca" opacity=".34"/></pattern></defs>
  <rect width="1200" height="630" fill="#282a36"/><rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="44" y="44" width="1112" height="542" fill="#21222c" stroke="#805bca" stroke-width="4"/>
  <rect x="68" y="68" width="18" height="18" fill="${card.accent}"/>
  <text x="104" y="84" fill="${card.accent}" font-family="${fonts.mono.family}" font-size="20" font-weight="700" letter-spacing="3">${escapeXml(card.eyebrow)}</text>
  <text x="68" y="302" fill="#f8f8f2" font-family="${fonts.title.family}" font-size="104" font-weight="800" letter-spacing="-4">${escapeXml(card.title)}</text>
  <rect x="68" y="344" width="186" height="10" fill="${card.accent}"/>
  ${detail}
  <text x="68" y="536" fill="#a5a6b5" font-family="${fonts.mono.family}" font-size="20" letter-spacing="2">PATRICKFANELLA.CO</text>
</svg>`
}

function findFontFile({ family, style, variable }) {
  const pattern = variable ? `${family}:variable=true:slant=0` : `${family}:style=${style}`
  const listed = execFileSync('fc-list', [pattern, '--format', '%{family[0]}\\t%{file}\\n'], { encoding: 'utf8' })
  const match = listed
    .split('\n')
    .map((line) => line.split('\t'))
    .find(([listedFamily, file]) => listedFamily === family && file)
  if (!match) {
    throw new Error(`Font not installed: ${family}${style ? ` ${style}` : ' (variable)'}. Install it and rerun; the cards are not drawn with fallback fonts.`)
  }
  return match[1]
}

async function createFontconfig(tempDir) {
  const fontDir = path.join(tempDir, 'fonts')
  const cacheDir = path.join(tempDir, 'cache')
  await mkdir(fontDir)
  await mkdir(cacheDir)
  const files = new Set(Object.values(fonts).map(findFontFile))
  for (const file of files) {
    await symlink(file, path.join(fontDir, path.basename(file)))
  }
  const configPath = path.join(tempDir, 'fonts.conf')
  await writeFile(
    configPath,
    `<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig><dir>${escapeXml(fontDir)}</dir><cachedir>${escapeXml(cacheDir)}</cachedir></fontconfig>\n`,
  )
  return configPath
}

async function main() {
  await mkdir(outputDir, { recursive: true })
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'patrick-social-'))
  try {
    const env = { ...process.env, FONTCONFIG_FILE: await createFontconfig(tempDir) }
    const cards = await loadCards()
    for (const card of cards) {
      const source = path.join(tempDir, `${card.file}.svg`)
      await writeFile(source, render(card))
      execFileSync('rsvg-convert', ['--width', '1200', '--height', '630', '--output', path.join(outputDir, card.file), source], { env })
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
  console.log(`Generated social cards in ${outputDir}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

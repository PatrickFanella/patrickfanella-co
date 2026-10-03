import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises'
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

const cards = [
  { file: 'patrick-fanella-portfolio-1200x630.png', eyebrow: 'SENIOR FULL-STACK / BACKEND', title: 'PATRICK FANELLA', detail: 'Reliable systems. Useful products.', accent: '#50fa7b' },
  { file: 'clpr-1200x630.png', eyebrow: 'CASE STUDY / PRODUCTION', title: 'CLPR', detail: 'Go, React, mobile, and hybrid search.', accent: '#50fa7b' },
  { file: 'patchwork-1200x630.png', eyebrow: 'CASE STUDY / PRE-ALPHA', title: 'PATCHWORK', detail: 'Mutual aid, AT Protocol, and location privacy.', accent: '#8be9fd' },
  { file: 'hasanara-1200x630.png', eyebrow: 'CASE STUDY / ACTIVE DEVELOPMENT', title: 'HASANARA', detail: 'Searchable long-form video intelligence.', accent: '#ff79c6' },
]

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function render(card) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="#805bca" opacity=".34"/></pattern></defs>
  <rect width="1200" height="630" fill="#282a36"/><rect width="1200" height="630" fill="url(#grid)"/>
  <rect x="44" y="44" width="1112" height="542" fill="#21222c" stroke="#805bca" stroke-width="4"/>
  <rect x="68" y="68" width="18" height="18" fill="${card.accent}"/>
  <text x="104" y="84" fill="${card.accent}" font-family="${fonts.mono.family}" font-size="20" font-weight="700" letter-spacing="3">${escapeXml(card.eyebrow)}</text>
  <text x="68" y="302" fill="#f8f8f2" font-family="${fonts.title.family}" font-size="104" font-weight="800" letter-spacing="-4">${escapeXml(card.title)}</text>
  <rect x="68" y="344" width="186" height="10" fill="${card.accent}"/>
  <text x="68" y="414" fill="#d7d7eb" font-family="${fonts.detail.family}" font-size="34" font-weight="500">${escapeXml(card.detail)}</text>
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
    for (const card of cards) {
      const source = path.join(tempDir, `${card.file}.svg`)
      await writeFile(source, render(card))
      execFileSync('rsvg-convert', ['--width', '1200', '--height', '630', '--output', path.join(outputDir, card.file), source], { env })
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
  console.log(`Generated ${cards.length} social cards in ${outputDir}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

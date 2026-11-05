import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = JSON.parse(await readFile(path.join(webRoot, '../db/seed/portfolio.json'), 'utf8'))
const slugs = new Set()

if (!Array.isArray(source.projects) || source.projects.length === 0) {
  throw new Error('The project catalog must contain projects')
}

const items = source.projects
  .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sortOrder - b.sortOrder || b.year - a.year || a.slug.localeCompare(b.slug, 'en'))
  .map(({ sortOrder: _sortOrder, ...project }) => {
    if (!/^[a-z0-9-]+$/.test(project.slug) || slugs.has(project.slug)) {
      throw new Error(`Invalid or duplicate project slug: ${project.slug}`)
    }
    slugs.add(project.slug)
    const kind = project.kind || 'case-study'
    const classification = project.classification || (project.featured ? 'flagship' : kind === 'highlight' ? 'experiment' : 'archive')
    const deliveryStatus = project.deliveryStatus || ({ flagship: 'Active', experiment: 'Experiment', archive: 'Archive' })[classification]
    return {
      ...project,
      kind,
      classification,
      deliveryStatus,
      periodLabel: project.periodLabel || String(project.year),
      stack: [...new Set(project.stack)].sort(),
    }
  })

const directory = path.join(webRoot, 'public/content')
await mkdir(directory, { recursive: true })
await writeFile(path.join(directory, 'projects.json'), JSON.stringify({ items }) + '\n')
console.log(`Prepared ${items.length} projects for the web artifact`)

// Real generated portfolio assets installed under web/public/assets/projects/<slug>/.
// Source: generated-portfolio-assets.zip (manifest.json).

export interface ProjectVideo {
  mp4: string
  webm: string
  poster: string
}

export interface ProjectAssets {
  hero?: string
  thumbSquare?: string
  thumbDirectory?: string
  figures: string[]
  video?: ProjectVideo
}

const base = '/assets/projects'

function still(slug: string, file: string) {
  return `${base}/${slug}/${file}`
}

function vid(slug: string, name: string): ProjectVideo {
  return {
    mp4: `${base}/${slug}/${name}.mp4`,
    webm: `${base}/${slug}/${name}.webm`,
    poster: `${base}/${slug}/${name}-poster.webp`,
  }
}

function pack(slug: string, opts: { hero?: boolean; thumbs?: boolean; figures?: number; video?: string } = {}): ProjectAssets {
  const { hero = false, thumbs = false, figures = 0, video } = opts
  const figs: string[] = []
  for (let i = 1; i <= figures; i++) figs.push(still(slug, `figure-${i}.webp`))
  return {
    hero: hero ? still(slug, 'hero.webp') : undefined,
    thumbSquare: thumbs ? still(slug, 'thumb-square.webp') : undefined,
    thumbDirectory: thumbs ? still(slug, 'thumb-directory.webp') : undefined,
    figures: figs,
    video: video ? vid(slug, video) : undefined,
  }
}

export const projectAssets: Record<string, ProjectAssets> = {
  artemis: pack('artemis', { hero: true, thumbs: true }),
  augr: pack('augr', { hero: true, thumbs: true, video: 'reasoning' }),
  clpr: pack('clpr', { hero: true, thumbs: true, figures: 5 }),
  clustr: pack('clustr', { hero: true, thumbs: true, figures: 5, video: 'graph' }),
  cutroom: pack('cutroom', { hero: true, thumbs: true, video: 'timeline' }),
  'discord-spywatcher': pack('discord-spywatcher', { thumbs: true, video: 'detection' }),
  edda: pack('edda', { hero: true, thumbs: true, video: 'agent-flow' }),
  galdr: pack('galdr', { hero: true, thumbs: true, video: 'workflow' }),
  'internet-id': pack('internet-id', { figures: 1 }),
  'jury-rigged': pack('jury-rigged', { figures: 1, video: 'reactive' }),
  'llama-line': pack('llama-line', { hero: true, thumbs: true, video: 'queue' }),
  ocq: pack('ocq', { hero: true, thumbs: true }),
  'open-pilot': pack('open-pilot', { hero: true, thumbs: true }),
  paqr: pack('paqr', { thumbs: true }),
  patchwork: pack('patchwork', { figures: 1, video: 'feed' }),
  'patrickfanella-co': pack('patrickfanella-co', { hero: true, thumbs: true }),
  soundhash: pack('soundhash', { figures: 1 }),
  subcorp: pack('subcorp', { hero: true, thumbs: true, figures: 5 }),
  subcults: pack('subcults', { thumbs: true, video: 'feed' }),
  'super-productivity-mcp': pack('super-productivity-mcp', { hero: true, thumbs: true }),
  'tmux-popups': pack('tmux-popups', { hero: true, thumbs: true, video: 'demo' }),
  'transcript-create': pack('transcript-create', {
    hero: true,
    thumbs: true,
    figures: 5,
    video: 'streaming',
  }),
  'vod-tender': pack('vod-tender', { thumbs: true, video: 'scrub' }),
}

export function assetsFor(slug: string): ProjectAssets {
  return projectAssets[slug] ?? { figures: [] }
}

import { useState } from 'react'

import type { ProjectMedia } from '../lib/api'
import { monoLabelClass, surfaceCardClass } from '../lib/styles'
import { CarouselNav } from './CarouselNav'
import { MediaDialog } from './MediaDialog'

const fallbackMediaSrc = '/assets/projects/project-fallback.svg'

type ProjectMediaGalleryProps = {
  items: ProjectMedia[]
  projectTitle: string
}

export function ProjectMediaGallery({ items, projectTitle }: ProjectMediaGalleryProps) {
  const [index, setIndex] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set())

  if (items.length === 0) return null

  const item = items[index]
  const failed = !item.src || failedSrcs.has(item.src)
  const src = failed ? fallbackMediaSrc : item.src
  const alt = failed ? `${projectTitle} placeholder artwork` : item.alt || `${projectTitle} supporting visual ${index + 1}`
  const caption = item.caption || `${projectTitle} supporting visual ${index + 1}`

  return (
    <>
      <figure className={`${surfaceCardClass} overflow-hidden bg-panel`}>
        <div className="flex items-center justify-between border-b-2 border-stroke bg-surface px-5 py-4">
          <p className={monoLabelClass}>{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</p>
          <button aria-label={`Expand ${caption}`} className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-heading hover:text-accent-green" onClick={() => setDialogOpen(true)} type="button">Expand</button>
        </div>
        <div className="border-b-2 border-stroke bg-surface" style={{ aspectRatio: '16 / 10' }}>
          <img
            alt={alt}
            className="h-full w-full object-contain"
            decoding="async"
            height="1000"
            loading="lazy"
            onError={() => { if (item.src) setFailedSrcs((current) => new Set(current).add(item.src)) }}
            sizes="(min-width: 1024px) 50vw, 100vw"
            src={src}
            srcSet={failed ? undefined : item.srcSet}
            width="1600"
          />
        </div>
        <div className="flex items-center justify-between gap-4 p-5">
          <figcaption className="text-[0.98rem] leading-relaxed text-ink-soft">{caption}</figcaption>
          {items.length > 1 ? (
            <CarouselNav
              nextLabel="Next project image"
              onNext={() => setIndex((index + 1) % items.length)}
              onPrev={() => setIndex((index - 1 + items.length) % items.length)}
              prevLabel="Previous project image"
            />
          ) : null}
        </div>
      </figure>
      <MediaDialog alt={alt} caption={caption} onClose={() => setDialogOpen(false)} open={dialogOpen} src={src} srcSet={failed ? undefined : item.srcSet} />
    </>
  )
}

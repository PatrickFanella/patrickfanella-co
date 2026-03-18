import { useState } from 'react'

import type { ProjectMedia } from '../lib/api'
import { monoLabelClass, surfaceCardClass } from '../lib/styles'

const fallbackMediaSrc = '/assets/projects/project-fallback.svg'

type ProjectMediaGalleryProps = {
  items: ProjectMedia[]
  projectTitle: string
}

type ProjectMediaCardProps = {
  item: ProjectMedia
  projectTitle: string
  index: number
}

export function ProjectMediaGallery({ items, projectTitle }: ProjectMediaGalleryProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {items.map((item, index) => (
        <ProjectMediaCard
          key={`${item.src || 'fallback'}-${index}`}
          item={item}
          projectTitle={projectTitle}
          index={index}
        />
      ))}
    </div>
  )
}

function ProjectMediaCard({ item, projectTitle, index }: ProjectMediaCardProps) {
  const [src, setSrc] = useState(item.src || fallbackMediaSrc)
  const [usingFallback, setUsingFallback] = useState(!item.src)

  const handleError = () => {
    if (src === fallbackMediaSrc) {
      return
    }

    setSrc(fallbackMediaSrc)
    setUsingFallback(true)
  }

  const altText = usingFallback
    ? `${projectTitle} placeholder artwork`
    : item.alt || `${projectTitle} supporting visual ${index + 1}`

  return (
    <figure className={`${surfaceCardClass} overflow-hidden bg-panel`}>
      <div className="border-b-2 border-stroke bg-surface px-5 py-4">
        <p className={monoLabelClass}>{`Media ${String(index + 1).padStart(2, '0')}`}</p>
      </div>

      <img
        className="w-full border-b-2 border-stroke bg-surface object-cover"
        src={src}
        alt={altText}
        loading="lazy"
        onError={handleError}
        style={{ aspectRatio: '16 / 10' }}
      />

      <figcaption className="grid gap-3 p-5 text-[0.98rem] leading-relaxed text-ink-soft">
        <p>{item.caption || 'Supporting visual for the case study.'}</p>
        {usingFallback ? (
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.15em] text-accent-purple">
            Placeholder visual in use
          </p>
        ) : null}
      </figcaption>
    </figure>
  )
}

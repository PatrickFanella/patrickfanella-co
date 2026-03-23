import { useCallback, useEffect, useRef, useState } from 'react'

import type { ProjectMedia } from '../lib/api'
import { monoLabelClass, surfaceCardClass } from '../lib/styles'
import { CarouselNav } from './CarouselNav'

const fallbackMediaSrc = '/assets/projects/project-fallback.svg'

const ROTATE_INTERVAL_MS = 6000

type ProjectMediaGalleryProps = {
  items: ProjectMedia[]
  projectTitle: string
}

export function ProjectMediaGallery({ items, projectTitle }: ProjectMediaGalleryProps) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(new Set())
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  if (items.length === 0) {
    return null
  }

  const item = items[index]
  const hasFailed = Boolean(item.src && failedSrcs.has(item.src))
  const src = !item.src || hasFailed ? fallbackMediaSrc : item.src
  const altText = hasFailed || !item.src
    ? `${projectTitle} placeholder artwork`
    : item.alt || `${projectTitle} supporting visual ${index + 1}`

  const advance = () => {
    setIndex((prev) => (prev + 1) % items.length)
  }

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, ROTATE_INTERVAL_MS)
  }

  const goTo = (next: number) => {
    setIndex(next)
    resetTimer()
  }

  const handleImageError = () => {
    if (item.src && !failedSrcs.has(item.src)) {
      setFailedSrcs((prev) => new Set(prev).add(item.src))
    }
  }

  return (
    <>
      <MediaCarousel
        items={items}
        index={index}
        item={item}
        src={src}
        altText={altText}
        timerRef={timerRef}
        onGoTo={goTo}
        onAdvance={advance}
        onOpen={() => setLightboxOpen(true)}
        onImageError={handleImageError}
      />

      {lightboxOpen ? (
        <MediaLightbox
          items={items}
          projectTitle={projectTitle}
          initialIndex={index}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  )
}

type MediaCarouselProps = {
  items: ProjectMedia[]
  index: number
  item: ProjectMedia
  src: string
  altText: string
  timerRef: React.RefObject<ReturnType<typeof setInterval> | null>
  onGoTo: (next: number) => void
  onAdvance: () => void
  onOpen: () => void
  onImageError: () => void
}

function MediaCarousel({ items, index, item, src, altText, timerRef, onGoTo, onAdvance, onOpen, onImageError }: MediaCarouselProps) {
  useEffect(() => {
    timerRef.current = setInterval(onAdvance, ROTATE_INTERVAL_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerRef, onAdvance])

  return (
    <figure className={`${surfaceCardClass} overflow-hidden bg-panel`}>
      <div className="flex items-center justify-between border-b-2 border-stroke bg-surface px-5 py-4">
        <p className={monoLabelClass}>{`${String(index + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`}</p>
        <button
          className="inline-flex cursor-pointer items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.15em] text-ink-soft transition-colors duration-150 hover:text-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green"
          onClick={onOpen}
          type="button"
          aria-label={`View ${item.caption || `media ${index + 1}`} fullscreen`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
          Expand
        </button>
      </div>

      <div className="border-b-2 border-stroke bg-surface" style={{ aspectRatio: '16 / 10' }}>
        <img
          className="h-full w-full object-contain"
          src={src}
          alt={altText}
          decoding="async"
          key={src}
          onError={onImageError}
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-5">
        <figcaption className="text-[0.98rem] leading-relaxed text-ink-soft">
          {item.caption || 'Supporting visual for the case study.'}
        </figcaption>

        <CarouselNav
          onPrev={() => onGoTo((index - 1 + items.length) % items.length)}
          onNext={() => onGoTo((index + 1) % items.length)}
        />
      </div>
    </figure>
  )
}

type MediaLightboxProps = {
  items: ProjectMedia[]
  projectTitle: string
  initialIndex: number
  onClose: () => void
}

function MediaLightbox({ items, projectTitle, initialIndex, onClose }: MediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const item = items[index]
  const altText = item.alt || `${projectTitle} supporting visual ${index + 1}`

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') goPrev()
      if (event.key === 'ArrowRight') goNext()
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose, goPrev, goNext])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-paper/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} media viewer`}
    >
      <div className="flex shrink-0 items-center justify-between border-b-2 border-stroke bg-surface px-5 py-4">
        <div className="flex items-center gap-4">
          <p className={monoLabelClass}>{item.caption || `Media ${String(index + 1).padStart(2, '0')}`}</p>
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.15em] text-ink-soft">
            {index + 1} / {items.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CarouselNav onPrev={goPrev} onNext={goNext} />
          <button
            aria-label="Close viewer"
            className="inline-flex cursor-pointer items-center justify-center border-2 border-stroke bg-surface px-4 py-3 text-heading transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-accent-green hover:text-accent-green hover:shadow-brutal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-x-0 active:translate-y-0 active:shadow-none"
            onClick={onClose}
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <img
          className="max-h-full max-w-full object-contain"
          src={item.src || fallbackMediaSrc}
          alt={altText}
          key={item.src}
        />
      </div>

      {item.alt ? (
        <div className="shrink-0 border-t-2 border-stroke bg-surface px-5 py-3">
          <p className="text-[0.85rem] leading-relaxed text-ink-soft">{item.alt}</p>
        </div>
      ) : null}
    </div>
  )
}

import { useEffect, useRef } from 'react'

import { monoLabelClass } from '../lib/styles'

type MediaDialogProps = {
  alt: string
  caption: string
  onClose: () => void
  open: boolean
  src: string
  srcSet?: string
}

export function MediaDialog({ alt, caption, onClose, open, src, srcSet }: MediaDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!dialog) return

    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = ''
      if (dialog.open && typeof dialog.close === 'function') dialog.close()
      else dialog.removeAttribute('open')
      previousFocus?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      aria-label={caption}
      className="m-auto max-h-[92vh] w-[min(92vw,90rem)] border-2 border-stroke bg-paper p-0 text-ink shadow-brutal backdrop:bg-paper/90"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      ref={dialogRef}
    >
      <div className="flex items-center justify-between gap-4 border-b-2 border-stroke bg-surface px-5 py-4">
        <p className={monoLabelClass}>{caption}</p>
        <button className="border-2 border-stroke bg-paper px-4 pt-[calc(0.5rem+0.5px)] pb-[calc(0.5rem-0.5px)] font-mono text-sm font-bold uppercase text-heading hover:border-accent-green hover:text-accent-green" onClick={onClose} ref={closeRef} type="button">Close</button>
      </div>
      <div className="grid max-h-[calc(92vh-5rem)] place-items-center overflow-auto p-4 sm:p-6">
        <img alt={alt} className="max-h-[75vh] max-w-full object-contain" sizes="92vw" src={src} srcSet={srcSet} />
      </div>
    </dialog>
  )
}

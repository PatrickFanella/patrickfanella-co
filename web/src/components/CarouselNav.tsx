const arrowButtonClass =
  'inline-flex cursor-pointer items-center justify-center border-2 border-stroke bg-surface px-4 py-3 text-heading transition-all duration-150 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-accent-green hover:text-accent-green hover:shadow-brutal-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:translate-x-0 active:translate-y-0 active:shadow-none'

function ArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

type CarouselNavProps = {
  onPrev: () => void
  onNext: () => void
  prevLabel?: string
  nextLabel?: string
}

export function CarouselNav({ onPrev, onNext, prevLabel = 'Previous', nextLabel = 'Next' }: CarouselNavProps) {
  return (
    <div className="flex shrink-0 gap-3">
      <button
        aria-label={prevLabel}
        className={arrowButtonClass}
        onClick={onPrev}
        type="button"
      >
        <ArrowLeft />
      </button>
      <button
        aria-label={nextLabel}
        className={arrowButtonClass}
        onClick={onNext}
        type="button"
      >
        <ArrowRight />
      </button>
    </div>
  )
}

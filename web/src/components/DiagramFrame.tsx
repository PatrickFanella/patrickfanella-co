import type { DiagramEntry } from '../data/diagrams'

interface DiagramFrameProps {
  diagram: DiagramEntry
  className?: string
}

// Renders a standalone HTML diagram (from /web/public/assets/diagrams/) in an iframe.
// The diagrams are self-contained SVG + inline CSS; we keep them sandboxed without
// allow-same-origin since they need no parent access.
export function DiagramFrame({ diagram, className = '' }: DiagramFrameProps) {
  const aspect = diagram.aspect ?? 16 / 10
  return (
    <figure className={`panel overflow-hidden ${className}`.trim()}>
      <div className="relative w-full bg-[#1a1b26]" style={{ aspectRatio: String(aspect), minHeight: '320px' }}>
        <iframe
          src={diagram.src}
          title={diagram.title}
          loading="lazy"
          scrolling="no"
          sandbox=""
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <figcaption className="border-t border-[color:var(--color-border)]/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-mono text-[color:var(--color-fg-dim)] flex items-center justify-between gap-3">
        <span>{diagram.title}</span>
        <span className="opacity-70">{diagram.kind}</span>
      </figcaption>
    </figure>
  )
}

interface DiagramGridProps {
  diagrams: DiagramEntry[]
  heading?: string
  className?: string
}

export function DiagramGrid({ diagrams, heading, className = '' }: DiagramGridProps) {
  if (diagrams.length === 0) return null
  return (
    <section className={className}>
      {heading && <h2 className="section-kicker">{heading}</h2>}
      <div className={`${heading ? 'mt-4' : ''} grid gap-4 md:grid-cols-2`}>
        {diagrams.map((diagram) => (
          <DiagramFrame key={diagram.src} diagram={diagram} />
        ))}
      </div>
    </section>
  )
}

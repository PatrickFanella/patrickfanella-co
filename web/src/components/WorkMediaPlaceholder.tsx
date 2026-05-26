type Accent = 'violet' | 'green' | 'amber'
type Variant = 'hero' | 'thumb'

interface Props {
  title: string
  kicker: string
  summary: string
  caption?: string
  accent?: Accent
  variant?: Variant
  className?: string
}

const accentMap: Record<Accent, string> = {
  violet: 'from-[color:var(--color-accent)]/35 via-transparent to-transparent',
  green: 'from-[color:var(--color-success)]/25 via-transparent to-transparent',
  amber: 'from-[color:var(--color-warning)]/25 via-transparent to-transparent',
}

export function WorkMediaPlaceholder({ title, kicker, summary, caption, accent = 'violet', variant = 'hero', className = '' }: Props) {
  if (variant === 'thumb') {
    return (
      <figure className={`surface overflow-hidden ${className}`.trim()}>
        <div
          role="img"
          aria-label={title}
          className={`relative isolate overflow-hidden bg-[linear-gradient(135deg,rgba(14,17,24,0.96),rgba(20,24,34,0.96))] ${accentMap[accent]}`}
        >
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="relative flex min-h-[8.5rem] flex-col justify-between gap-2 p-3">
            <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.22em] font-mono text-[color:var(--color-fg-dim)]">
              <span>{kicker}</span>
              <span aria-hidden className="inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)] shadow-[0_0_14px_rgba(213,162,76,0.65)]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold font-display leading-tight text-[color:var(--color-fg)]">{title}</h3>
              <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-[color:var(--color-fg-muted)]">{summary}</p>
            </div>
          </div>
        </div>
        {caption && <figcaption className="border-t border-[color:var(--color-border)] px-3 py-2 text-[10px] text-[color:var(--color-fg-dim)]">{caption}</figcaption>}
        {/* TODO asset: create a compact thumbnail matching the above placeholder description. */}
      </figure>
    )
  }

  return (
    <figure className={`surface overflow-hidden ${className}`.trim()}>
      <div
        role="img"
        aria-label={title}
        className={`relative isolate overflow-hidden bg-[linear-gradient(135deg,rgba(14,17,24,0.96),rgba(20,24,34,0.96))] ${accentMap[accent]}`}
      >
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative grid gap-4 p-4 sm:p-5 min-h-[12rem]">
          <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] font-mono text-[color:var(--color-fg-dim)]">
            <span>{kicker}</span>
            <span aria-hidden className="inline-flex h-2 w-2 rounded-full bg-[color:var(--color-accent)] shadow-[0_0_18px_rgba(141,107,255,0.75)]" />
          </div>
          <div className="grid gap-3 rounded-[var(--radius-lg)] border border-[color:var(--color-border-strong)] bg-[color:var(--color-surface)]/75 p-4 shadow-[var(--shadow-soft)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-[color:var(--color-fg-dim)]">Preview asset</div>
                <h3 className="mt-1 text-lg font-semibold font-display leading-tight text-[color:var(--color-fg)]">{title}</h3>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[color:var(--color-fg-dim)]">
                <span className="rounded-full border border-[color:var(--color-border)] px-2 py-1">Wireframe</span>
                <span className="rounded-full border border-[color:var(--color-border)] px-2 py-1">Placeholder</span>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-[color:var(--color-fg-muted)]">{summary}</p>
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
              <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-3">
                <div className="h-2 w-16 rounded-full bg-[color:var(--color-accent)]/60" />
                <div className="mt-3 space-y-2">
                  <div className="h-2 rounded-full bg-[color:var(--color-border-strong)]/90" />
                  <div className="h-2 w-5/6 rounded-full bg-[color:var(--color-border-strong)]/75" />
                  <div className="h-2 w-2/3 rounded-full bg-[color:var(--color-border-strong)]/60" />
                </div>
              </div>
              <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 rounded-md bg-[color:var(--color-accent)]/12 border border-[color:var(--color-border-strong)]" />
                  <div className="h-10 rounded-md bg-[color:var(--color-success)]/12 border border-[color:var(--color-border-strong)]" />
                  <div className="h-10 rounded-md bg-[color:var(--color-warning)]/12 border border-[color:var(--color-border-strong)]" />
                  <div className="h-10 rounded-md bg-[color:var(--color-surface-3)] border border-[color:var(--color-border-strong)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {caption && <figcaption className="border-t border-[color:var(--color-border)] px-4 py-3 text-xs text-[color:var(--color-fg-dim)]">{caption}</figcaption>}
      {/* TODO asset: create a real visual for the above description; keep the layout and alt language aligned to this placeholder. */}
    </figure>
  )
}

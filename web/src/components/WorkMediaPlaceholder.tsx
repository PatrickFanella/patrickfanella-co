type Accent = 'violet' | 'green' | 'amber'
type Variant = 'wide' | 'square' | 'portrait' | 'inline'

export interface MediaVideo {
  mp4: string
  webm: string
  poster: string
}

interface Props {
  title: string
  kicker: string
  summary: string
  caption?: string
  accent?: Accent
  variant?: Variant
  className?: string
  /** Optional real image asset. When provided, renders <img> instead of the wireframe placeholder. */
  src?: string
  /** Optional motion asset. Takes precedence over `src`. */
  video?: MediaVideo
  /** Object-fit override; defaults to 'cover'. */
  fit?: 'cover' | 'contain'
}

const accentMap: Record<Accent, string> = {
  violet: 'from-[color:var(--color-accent)]/35 via-transparent to-transparent',
  green: 'from-[color:var(--color-success)]/25 via-transparent to-transparent',
  amber: 'from-[color:var(--color-warning)]/25 via-transparent to-transparent',
}

const variantMap: Record<Variant, { shell: string; body: string; label: string; summary: string; caption: string }> = {
  wide: {
    shell: 'aspect-[16/9] max-h-[32rem]',
    body: 'p-4 sm:p-5',
    label: 'text-[10px] uppercase tracking-[0.22em] font-mono',
    summary: 'max-w-xl text-sm leading-relaxed',
    caption: 'text-xs',
  },
  square: {
    shell: 'aspect-square max-h-[28rem]',
    body: 'p-4 sm:p-5',
    label: 'text-[10px] uppercase tracking-[0.22em] font-mono',
    summary: 'max-w-lg text-sm leading-relaxed',
    caption: 'text-xs',
  },
  portrait: {
    shell: 'aspect-[4/5] max-h-[34rem]',
    body: 'p-4 sm:p-5',
    label: 'text-[10px] uppercase tracking-[0.22em] font-mono',
    summary: 'max-w-lg text-sm leading-relaxed',
    caption: 'text-xs',
  },
  inline: {
    shell: 'aspect-[16/9] max-h-[20rem]',
    body: 'p-3 sm:p-4',
    label: 'text-[9px] uppercase tracking-[0.22em] font-mono',
    summary: 'max-w-xl text-[11px] sm:text-sm leading-relaxed',
    caption: 'text-[10px] sm:text-xs',
  },
}

export function WorkMediaPlaceholder({
  title,
  kicker,
  summary,
  caption,
  accent = 'violet',
  variant = 'inline',
  className = '',
  src,
  video,
  fit = 'cover',
}: Props) {
  const variantStyle = variantMap[variant]
  const hasAsset = Boolean(video || src)
  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover'

  return (
    <figure className={`surface overflow-hidden ${className}`.trim()}>
      <div
        role="img"
        aria-label={title}
        className={`relative isolate w-full overflow-hidden bg-[linear-gradient(135deg,rgba(14,17,24,0.96),rgba(20,24,34,0.96))] ${accentMap[accent]} ${variantStyle.shell}`}
      >
        {hasAsset ? (
          video ? (
            <video
              className={`absolute inset-0 h-full w-full ${fitClass}`}
              poster={video.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={title}
            >
              <source src={video.webm} type="video/webm" />
              <source src={video.mp4} type="video/mp4" />
            </video>
          ) : (
            <img
              src={src}
              alt={title}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full ${fitClass}`}
            />
          )
        ) : (
          <>
            <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className={`relative flex h-full min-h-0 flex-col justify-between gap-4 ${variantStyle.body}`}>
              <div className={`${variantStyle.label} flex items-center justify-between gap-3 text-[color:var(--color-fg-dim)]`}>
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
                <p className={`text-[color:var(--color-fg-muted)] ${variantStyle.summary}`.trim()}>{summary}</p>
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
          </>
        )}
      </div>
      {caption && <figcaption className={`border-t border-[color:var(--color-border)] px-4 py-3 text-[color:var(--color-fg-dim)] ${variantStyle.caption}`.trim()}>{caption}</figcaption>}
    </figure>
  )
}

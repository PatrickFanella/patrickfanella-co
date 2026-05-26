import { Link } from 'react-router-dom'

export function ResumeContactCTA() {
  return (
    <section aria-labelledby="cta-heading" className="container-page py-20 lg:py-28 border-t border-[color:var(--color-border)]/60">
      <div className="surface-2 p-8 md:p-12 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">What's next</p>
          <h2 id="cta-heading" className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            You've seen the work — now the practical bits.
          </h2>
          <p className="mt-3 text-[color:var(--color-fg-muted)] max-w-xl">
            Resume covers experience, stack depth, and downloadable PDF. Contact covers the right way to reach out and what I'm available for.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col gap-3">
          <Link
            to="/resume"
            className="text-center rounded-md bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] font-medium px-5 py-3 hover:bg-[color:var(--color-accent-soft)] transition-colors"
          >
            View Resume
          </Link>
          <Link
            to="/contact"
            className="text-center rounded-md border border-[color:var(--color-border-strong)] px-5 py-3 hover:bg-[color:var(--color-bg-elev)] transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}

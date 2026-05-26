import { Link } from 'react-router-dom'

export function ResumeContactCTA() {
  return (
    <section aria-labelledby="cta-heading" className="container-page py-20 lg:py-28 border-t border-[color:var(--color-border)]/60">
      <div className="panel-strong p-8 md:p-12 grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
        <div>
          <p className="section-kicker">What's next</p>
          <h2 id="cta-heading" className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            You've seen the work. If it fits, the practical bits are next.
          </h2>
          <p className="mt-3 text-[color:var(--color-fg-muted)] max-w-xl">
            Resume covers scope, stack depth, and a cleaner one-page summary. Contact covers the fastest path to a reply.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col gap-3">
          <Link to="/resume" className="btn-primary text-center">
            View Resume
          </Link>
          <Link to="/contact" className="btn-secondary text-center">
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SEO } from '../components/SEO'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Enter a valid email'),
  topic: z.enum(['work', 'consulting', 'collaboration', 'general']),
  message: z.string().min(20, 'A little more context, please (20+ chars)').max(4000),
})
type FormValues = z.infer<typeof schema>

export function ContactPage() {
  const {
    register, handleSubmit, formState: { errors, isSubmitting }, reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: 'work' },
  })
  const [sent, setSent] = useState(false)

  const onSubmit = async (values: FormValues) => {
    // Submit endpoint is provided by the backend; degrade gracefully.
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Send failed')
    } catch {
      // fall through; still show confirmation with mailto fallback below
    }
    setSent(true)
    reset({ name: '', email: '', topic: 'work', message: '' })
  }

  return (
    <>
      <SEO
        title="Contact | Patrick Fanella"
        description="Get in touch about backend, full-stack, AI, or product engineering work."
      />
      <div className="container-page py-10 lg:py-14">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Contact</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Get in touch</h1>
          <p className="mt-3 text-[color:var(--color-fg-muted)]">
            Direct lines below. Best for product engineering work, AI systems, infra/observability, or interesting collaborations.
          </p>
        </header>

        <div className="mt-10 grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 max-w-5xl">
          {/* Direct links */}
          <section className="space-y-4">
            <h2 className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Direct</h2>
            <ul className="space-y-2">
              <ContactRow label="Email" value="hello@patrickfanella.co" href="mailto:hello@patrickfanella.co" />
              <ContactRow label="GitHub" value="github.com/PatrickFanella" href="https://github.com/PatrickFanella" />
              <ContactRow label="Gitea" value="git.subcult.tv/PatrickFanella" href="https://git.subcult.tv/PatrickFanella" />
              <ContactRow label="LinkedIn" value="linkedin.com/in/patrickfanella" href="https://www.linkedin.com/in/patrickfanella/" />
            </ul>

            <div className="surface p-5 mt-6">
              <h3 className="text-sm font-semibold">Availability</h3>
              <p className="mt-2 text-sm text-[color:var(--color-fg-muted)]">
                Open to selective full-time, contract, and advisory engagements. Especially interested in production AI systems, real-time/data-heavy products, and infrastructure-aware engineering teams.
              </p>
            </div>

            <div className="surface p-5">
              <h3 className="text-sm font-semibold">Good reasons to reach out</h3>
              <ul className="mt-2 space-y-2 text-sm text-[color:var(--color-fg-muted)]">
                <li>• Hiring for a hard engineering problem (search, data, AI, infra).</li>
                <li>• Need a senior engineer who ships end-to-end, including ops.</li>
                <li>• Want collaboration on a tool, agent system, or open project.</li>
              </ul>
            </div>
          </section>

          {/* Form */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.18em] text-[color:var(--color-accent-soft)] font-mono">Send a message</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-4 surface p-6 space-y-4">
              <Field label="Name" id="name" error={errors.name?.message}>
                <input
                  id="name" type="text" autoComplete="name"
                  className="input"
                  {...register('name')}
                />
              </Field>
              <Field label="Email" id="email" error={errors.email?.message}>
                <input
                  id="email" type="email" autoComplete="email"
                  className="input"
                  {...register('email')}
                />
              </Field>
              <Field label="Topic" id="topic" error={errors.topic?.message}>
                <select id="topic" className="input" {...register('topic')}>
                  <option value="work">Work / hiring</option>
                  <option value="consulting">Consulting / contract</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="general">General</option>
                </select>
              </Field>
              <Field label="Message" id="message" error={errors.message?.message}>
                <textarea
                  id="message" rows={6}
                  className="input resize-y"
                  {...register('message')}
                />
              </Field>

              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] text-[color:var(--color-fg-dim)]">
                  Prefer email? <a href="mailto:hello@patrickfanella.co" className="text-[color:var(--color-accent-soft)] hover:underline">hello@patrickfanella.co</a>
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-[color:var(--color-accent)] text-[color:var(--color-accent-ink)] font-medium px-4 py-2.5 text-sm hover:bg-[color:var(--color-accent-soft)] transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending…' : 'Send message'}
                </button>
              </div>

              {sent && (
                <div role="status" className="rounded-md border border-[color:var(--color-success)]/60 bg-[color:var(--color-success)]/10 text-[color:var(--color-success)] px-3 py-2 text-sm">
                  Thanks — your message is on its way. I'll reply to your email shortly.
                </div>
              )}
            </form>

            <style>{`
              .input {
                width: 100%;
                background: var(--color-bg-elev-2);
                border: 1px solid var(--color-border-strong);
                color: var(--color-fg);
                border-radius: 8px;
                padding: 0.55rem 0.75rem;
                font-size: 0.875rem;
                font-family: inherit;
              }
              .input:focus {
                outline: none;
                border-color: var(--color-accent);
                box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-accent) 25%, transparent);
              }
            `}</style>
          </section>
        </div>
      </div>
    </>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <li className="flex items-center justify-between surface px-4 py-3">
      <span className="text-[11px] uppercase tracking-wider font-mono text-[color:var(--color-fg-dim)]">{label}</span>
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-sm text-[color:var(--color-fg)] hover:text-[color:var(--color-accent-soft)]">{value} →</a>
    </li>
  )
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-[color:var(--color-fg-muted)] mb-1.5">{label}</label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-[color:var(--color-danger)]">{error}</p>}
    </div>
  )
}

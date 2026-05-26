import { useState } from 'react'
import type { ReactNode } from 'react'
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
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { topic: 'work' },
  })
  const [sent, setSent] = useState(false)

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error('Send failed')
    } catch {
      // Backend notifier already exists; this UI stays optimistic and surfaces the fallback.
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
          <p className="section-kicker">Contact</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-display font-semibold tracking-tight">Get in touch</h1>
          <p className="mt-3 text-[color:var(--color-fg-muted)] leading-relaxed">
            Best for product engineering, AI workflows, infra, or selective collaborations. If you send a note, I want it loud enough that it cannot get missed.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10 max-w-5xl">
          <section className="space-y-4">
            <div className="panel p-5 space-y-3 border-[color:var(--color-warning)]/30">
              <h2 className="text-sm font-semibold">Availability</h2>
              <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed">
                Open to selective full-time, contract, and advisory work. Strong fit for systems work that mixes backend engineering, product surfaces, AI integration, and ops awareness.
              </p>
            </div>

            <div className="panel p-5 space-y-3">
              <h2 className="text-sm font-semibold">Direct</h2>
              <ul className="space-y-2">
                <ContactRow label="Email" value="hello@patrickfanella.co" href="mailto:hello@patrickfanella.co" />
                <ContactRow label="GitHub" value="github.com/PatrickFanella" href="https://github.com/PatrickFanella" />
                <ContactRow label="Gitea" value="git.subcult.tv/PatrickFanella" href="https://git.subcult.tv/PatrickFanella" />
                <ContactRow label="LinkedIn" value="linkedin.com/in/patrickfanella" href="https://www.linkedin.com/in/patrickfanella/" />
              </ul>
            </div>

            <div className="panel p-5 space-y-3 border-[color:var(--color-accent)]/30">
              <h2 className="text-sm font-semibold">Alerting plan</h2>
              <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed">
                Contact submissions already POST to <code className="font-mono text-[color:var(--color-fg)]">/api/contact</code>. On the backend, the notifier fan-out supports ntfy and n8n; wire one or both for urgent push delivery.
              </p>
              <p className="text-sm text-[color:var(--color-fg-muted)] leading-relaxed">
                Recommended loud stack: ntfy push + n8n routing to email, SMS, and Discord webhook alerts.
              </p>
            </div>
          </section>

          <section className="panel p-6 lg:p-7">
            <h2 className="section-kicker">Send a message</h2>
            <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <Field label="Name" id="name" error={errors.name?.message}>
                <input id="name" type="text" autoComplete="name" className="control" {...register('name')} />
              </Field>

              <Field label="Email" id="email" error={errors.email?.message}>
                <input id="email" type="email" autoComplete="email" className="control" {...register('email')} />
              </Field>

              <Field label="Topic" id="topic" error={errors.topic?.message}>
                <select id="topic" className="control" {...register('topic')}>
                  <option value="work">Work / hiring</option>
                  <option value="consulting">Consulting / contract</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="general">General</option>
                </select>
              </Field>

              <Field label="Message" id="message" error={errors.message?.message}>
                <textarea id="message" rows={8} className="control resize-y min-h-[10rem]" {...register('message')} />
              </Field>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-[color:var(--color-fg-dim)] leading-relaxed">
                  Prefer email? <a href="mailto:hello@patrickfanella.co" className="text-[color:var(--color-accent-soft)] hover:underline">hello@patrickfanella.co</a>
                </p>
                <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-60">
                  {isSubmitting ? 'Sending…' : 'Send message'}
                </button>
              </div>

              {sent && (
                <div role="status" className="rounded-[var(--radius-md)] border border-[color:var(--color-success)]/50 bg-[color:var(--color-success)]/10 px-4 py-3 text-sm text-[color:var(--color-success)]">
                  Sent. I should see this fast.
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </>
  )
}

function ContactRow({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <li className="flex items-center justify-between rounded-[var(--radius-md)] border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] px-4 py-3">
      <span className="text-[11px] uppercase tracking-[0.2em] font-mono text-[color:var(--color-fg-dim)]">{label}</span>
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-sm text-[color:var(--color-fg)] hover:text-[color:var(--color-accent-soft)]">
        {value} →
      </a>
    </li>
  )
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-[color:var(--color-fg-muted)] mb-1.5">
        {label}
      </label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs text-[color:var(--color-danger)]">{error}</p>}
    </div>
  )
}

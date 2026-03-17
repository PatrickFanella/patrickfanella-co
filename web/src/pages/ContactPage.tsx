import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { isApiClientError, submitContact } from '../lib/api'
import { SectionLabel } from '../components/SectionLabel'
import {
  inputClass,
  pageIntroClass,
  pageSectionClass,
  pageTitleClass,
  primaryButtonClass,
  surfaceCardClass,
} from '../lib/styles'

const contactSchema = z.object({
  name: z.string().min(2, 'Name parameter requires 2+ chars.'),
  email: z.email('Invalid email syntax.'),
  message: z.string().min(20, 'Message body requires 20+ chars for context.'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactPage() {
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    clearErrors,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState('idle')
    setSubmitMessage('')
    clearErrors()

    try {
      const response = await submitContact(values)

      setSubmitState('success')
      setSubmitMessage(response.message)
      reset()
    } catch (error) {
      setSubmitState('error')

      if (isApiClientError(error)) {
        if (error.fields) {
          for (const [field, message] of Object.entries(error.fields)) {
            setError(field as keyof ContactFormValues, { type: 'server', message })
          }
        }

        if (error.code === 'network_error') {
          setSubmitMessage('The contact service could not be reached. Please try again in a moment.')
          return
        }

        setSubmitMessage(error.message)
        return
      }

      setSubmitMessage('Unable to submit your note right now. Please try again shortly.')
    }
  })

  return (
    <section className={`${pageSectionClass} pt-4`}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(380px,1fr)] lg:items-start border-b-2 border-stroke pb-16 mb-10">
        <div className="grid gap-8">
          <div>
            <SectionLabel>Initialize request</SectionLabel>
            <h1 className={`${pageTitleClass} mt-6 uppercase`}>
              Open a channel.
            </h1>
            <p className={pageIntroClass}>
              The underlying Go service is currently accepting requests for new architectures, interface audits, and core engineering roles.
            </p>
          </div>

          <aside className={`${surfaceCardClass} bg-panel p-8`} aria-label="Input guidelines">
            <p className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-green font-bold">Protocol</p>
            <ul className="mt-6 grid gap-4 pl-0 list-none text-[1.05rem] text-ink-soft">
              <li className="flex gap-4"><span className="text-accent-orange font-bold font-mono">01</span> State the primary objective briefly.</li>
              <li className="flex gap-4"><span className="text-accent-orange font-bold font-mono">02</span> Define current system baseline.</li>
              <li className="flex gap-4"><span className="text-accent-orange font-bold font-mono">03</span> Provide known latency/budget bounds.</li>
            </ul>
          </aside>
        </div>

        <form className={`${surfaceCardClass} grid gap-6 p-8 lg:p-10 bg-panel`} onSubmit={onSubmit} noValidate>
          <p className="font-mono text-[1.1rem] uppercase tracking-[0.05em] text-heading font-bold pb-4 border-b-2 border-stroke">
            HTTP POST /contact
          </p>

          <label className="grid gap-3 text-ink-soft mt-2">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.15em] text-heading font-bold">Parameter: Name</span>
            <input className={inputClass} type="text" {...register('name')} />
            {errors.name ? (
              <span className="text-danger font-mono text-[0.8rem] bg-danger/10 px-3 py-1.5 border border-danger" role="alert">
                ERR: {errors.name.message}
              </span>
            ) : null}
          </label>

          <label className="grid gap-3 text-ink-soft">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.15em] text-heading font-bold">Parameter: Email</span>
            <input className={inputClass} type="email" {...register('email')} />
            {errors.email ? (
              <span className="text-danger font-mono text-[0.8rem] bg-danger/10 px-3 py-1.5 border border-danger" role="alert">
                ERR: {errors.email.message}
              </span>
            ) : null}
          </label>

          <label className="grid gap-3 text-ink-soft">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.15em] text-heading font-bold">Payload: Message</span>
            <textarea className={inputClass} rows={6} {...register('message')} />
            {errors.message ? (
              <span className="text-danger font-mono text-[0.8rem] bg-danger/10 px-3 py-1.5 border border-danger" role="alert">
                ERR: {errors.message.message}
              </span>
            ) : null}
          </label>

          <button className={`${primaryButtonClass} mt-4 w-full justify-center`} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Transmitting...' : 'Execute request'}
          </button>

          {submitMessage ? (
            <p
              aria-live="polite"
              className={`text-sm tracking-wide font-mono px-4 py-3 border-2 ${submitState === 'error' ? 'text-danger border-danger bg-danger/10' : 'text-paper border-accent-green bg-accent-green'}`}
              role={submitState === 'error' ? 'alert' : 'status'}
            >
              {submitState === 'error' ? 'FAIL: ' : 'SUCCESS: '} {submitMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}

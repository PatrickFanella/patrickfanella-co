import { zodResolver } from '@hookform/resolvers/zod'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { isApiClientError, submitContact } from '../lib/api'
import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import {
  monoLabelClass,
  inputClass,
  pageIntroClass,
  pageSectionClass,
  pageTitleClass,
  primaryButtonClass,
  surfaceCardClass,
  textLinkClass,
} from '../lib/styles'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter at least 2 characters.'),
  email: z.email('Please enter a valid email address.'),
  message: z.string().min(20, 'Please include a bit more context so I can respond helpfully.'),
  website: z.string(),
})

type ContactFormValues = z.infer<typeof contactSchema>

const alternateContactPaths = [
  {
    title: 'GitHub profile',
    href: 'https://github.com/PatrickFanella',
    description: 'Browse my repositories, commit history, and the practical work behind the case studies across Go, TypeScript, Python, and Solidity.',
    cta: 'Open GitHub ↗',
  },
  {
    title: 'Portfolio source',
    href: 'https://github.com/PatrickFanella/patrickfanella-co',
    description: 'Review the React + Go + PostgreSQL source behind this portfolio, with the same stack discipline applied to the site itself.',
    cta: 'Open repository ↗',
  },
]

export function ContactPage() {
  const nameFieldId = useId()
  const emailFieldId = useId()
  const messageFieldId = useId()
  const honeypotFieldId = useId()
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
    defaultValues: {
      website: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState('idle')
    setSubmitMessage('')
    clearErrors()

    try {
      const response = await submitContact({
        email: values.email,
        message: values.message,
        name: values.name,
        website: values.website,
      })

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
          setSubmitMessage('The contact form couldn\'t be reached. Please try again in a moment.')
          return
        }

        setSubmitMessage(error.message)
        return
      }

      setSubmitMessage('Something went wrong while sending your message. Please try again shortly.')
    }
  })

  return (
    <section className={`${pageSectionClass} pt-4`}>
      <Seo
        description="Start a conversation with Patrick Fanella about backend, full stack, AI-driven, or real-time product work."
        path="/contact"
        title="Contact"
      />
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(380px,1fr)] lg:items-start border-b-2 border-stroke pb-16 mb-10">
        <div className="grid gap-8">
          <div>
            <SectionLabel>Contact</SectionLabel>
            <h1 className={`${pageTitleClass} mt-6 uppercase`}>
              Let's build something useful.
            </h1>
            <p className={pageIntroClass}>
              I'm strongest on full-stack and backend roles, especially teams building real-time systems or AI-driven products. If you value production discipline alongside shipping speed, we should talk.
            </p>
          </div>

          <aside className={`${surfaceCardClass} bg-panel p-8`} aria-label="Input guidelines">
            <p className={monoLabelClass}>How to make this easy</p>
            <ul className="mt-6 grid gap-4 pl-0 list-none text-[1.05rem] text-ink-soft">
              <li className="flex gap-4"><span className="text-accent-orange font-bold font-mono">01</span> Tell me about the role, project, or collaboration.</li>
              <li className="flex gap-4"><span className="text-accent-orange font-bold font-mono">02</span> Share timing, team context, and any important constraints.</li>
              <li className="flex gap-4"><span className="text-accent-orange font-bold font-mono">03</span> Link anything relevant: repo, product, brief, or design direction.</li>
            </ul>
          </aside>

          <div className="grid gap-4 sm:grid-cols-2">
            {alternateContactPaths.map((path) => (
              <a
                key={path.href}
                className={`${surfaceCardClass} grid gap-4 bg-surface p-6 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-purple hover:shadow-brutal-purple`}
                href={path.href}
                rel="noreferrer"
                target="_blank"
              >
                <p className={monoLabelClass}>{path.title}</p>
                <p className="text-[1rem] leading-relaxed text-ink-soft">{path.description}</p>
                <span className={textLinkClass}>{path.cta}</span>
              </a>
            ))}
          </div>
        </div>

        <form className={`${surfaceCardClass} grid gap-6 p-8 lg:p-10 bg-panel`} onSubmit={onSubmit} noValidate>
          <p className="font-mono text-[1.1rem] uppercase tracking-[0.05em] text-heading font-bold pb-4 border-b-2 border-stroke">
            Send a message
          </p>

          <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label className="grid gap-2" htmlFor={honeypotFieldId}>
              <span>Website</span>
              <input autoComplete="off" id={honeypotFieldId} tabIndex={-1} type="text" {...register('website')} />
            </label>
          </div>

          <label className="grid gap-3 text-ink-soft mt-2">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.15em] text-heading font-bold">Name</span>
            <input
              aria-describedby={errors.name ? `${nameFieldId}-error` : undefined}
              aria-invalid={Boolean(errors.name)}
              className={inputClass}
              id={nameFieldId}
              type="text"
              {...register('name')}
            />
            {errors.name ? (
              <span className="text-danger font-mono text-[0.8rem] bg-danger/10 px-3 py-1.5 border border-danger" id={`${nameFieldId}-error`} role="alert">
                Error: {errors.name.message}
              </span>
            ) : null}
          </label>

          <label className="grid gap-3 text-ink-soft">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.15em] text-heading font-bold">Email</span>
            <input
              aria-describedby={errors.email ? `${emailFieldId}-error` : undefined}
              aria-invalid={Boolean(errors.email)}
              className={inputClass}
              id={emailFieldId}
              type="email"
              {...register('email')}
            />
            {errors.email ? (
              <span className="text-danger font-mono text-[0.8rem] bg-danger/10 px-3 py-1.5 border border-danger" id={`${emailFieldId}-error`} role="alert">
                Error: {errors.email.message}
              </span>
            ) : null}
          </label>

          <label className="grid gap-3 text-ink-soft">
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.15em] text-heading font-bold">Message</span>
            <textarea
              aria-describedby={errors.message ? `${messageFieldId}-error` : undefined}
              aria-invalid={Boolean(errors.message)}
              className={inputClass}
              id={messageFieldId}
              rows={6}
              {...register('message')}
            />
            {errors.message ? (
              <span className="text-danger font-mono text-[0.8rem] bg-danger/10 px-3 py-1.5 border border-danger" id={`${messageFieldId}-error`} role="alert">
                Error: {errors.message.message}
              </span>
            ) : null}
          </label>

          <button className={`${primaryButtonClass} mt-4 w-full justify-center`} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {submitMessage ? (
            <p
              aria-live="polite"
              className={`text-sm tracking-wide font-mono px-4 py-3 border-2 ${submitState === 'error' ? 'text-danger border-danger bg-danger/10' : 'text-paper border-accent-green bg-accent-green'}`}
              role={submitState === 'error' ? 'alert' : 'status'}
            >
              {submitState === 'error' ? 'Error: ' : 'Success: '} {submitMessage}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}

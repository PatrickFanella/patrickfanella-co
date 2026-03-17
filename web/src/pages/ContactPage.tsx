import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { SectionLabel } from '../components/SectionLabel'
import {
  inputClass,
  pageIntroClass,
  pageTitleClass,
  primaryButtonClass,
  surfaceCardClass,
} from '../lib/styles'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.email('Please enter a valid email address.'),
  message: z.string().min(20, 'A little more detail helps — aim for at least 20 characters.'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export function ContactPage() {
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitState('idle')
    setSubmitMessage('')

    try {
      const response = await fetch(`${apiBaseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('The message could not be sent yet.')
      }

      setSubmitState('success')
      setSubmitMessage('Thanks — your note is on file.')
      reset()
    } catch {
      setSubmitState('error')
      setSubmitMessage('The form is wired up, but the API is not reachable yet.')
    }
  })

  return (
    <section className={`grid gap-6 px-1 pt-5 pb-4 md:grid-cols-[1.7fr_1fr] md:items-start`}>
      <div>
        <SectionLabel>Contact</SectionLabel>
        <h1 className={`${pageTitleClass} mt-3`}>
          Let&apos;s talk about projects, freelance work, or collaboration.
        </h1>
        <p className={pageIntroClass}>
          This starter form is connected to the Go API route and ready to store messages
          once PostgreSQL is running locally.
        </p>
      </div>

      <form className={`${surfaceCardClass} grid gap-4.5 p-6`} onSubmit={onSubmit} noValidate>
        <label className="grid gap-2.5 text-ink-soft">
          Name
          <input className={inputClass} type="text" {...register('name')} />
          {errors.name ? <span className="text-danger">{errors.name.message}</span> : null}
        </label>

        <label className="grid gap-2.5 text-ink-soft">
          Email
          <input className={inputClass} type="email" {...register('email')} />
          {errors.email ? <span className="text-danger">{errors.email.message}</span> : null}
        </label>

        <label className="grid gap-2.5 text-ink-soft">
          Message
          <textarea className={inputClass} rows={6} {...register('message')} />
          {errors.message ? <span className="text-danger">{errors.message.message}</span> : null}
        </label>

        <button className={primaryButtonClass} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send message'}
        </button>

        {submitMessage ? (
          <p className={submitState === 'error' ? 'text-danger' : 'text-success'}>
            {submitMessage}
          </p>
        ) : null}
      </form>
    </section>
  )
}

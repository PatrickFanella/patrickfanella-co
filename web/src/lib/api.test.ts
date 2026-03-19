import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchProject, fetchProjects, getApiBaseUrl, submitContact } from './api'

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('returns the configured base url without a trailing slash', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8080/')

    expect(getApiBaseUrl()).toBe('http://localhost:8080')
  })

  it('loads projects from the wrapped list payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [
              {
                slug: 'demo',
                title: 'Demo',
                summary: 'Summary',
                description: 'Description',
                role: 'Developer',
                year: 2026,
                stack: [],
                featured: true,
                highlights: [],
                architecture: [],
                lessons: [],
                media: [],
              },
            ],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    )

    await expect(fetchProjects()).resolves.toEqual([
      expect.objectContaining({ slug: 'demo', title: 'Demo' }),
    ])
  })

  it('loads a single project from the wrapped detail payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            item: {
              slug: 'demo',
              title: 'Demo',
              summary: 'Summary',
              description: 'Description',
              role: 'Developer',
              year: 2026,
              stack: [],
              featured: true,
              highlights: [],
              architecture: [],
              lessons: [],
              media: [],
            },
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    )

    await expect(fetchProject('demo')).resolves.toEqual(expect.objectContaining({ slug: 'demo' }))
  })

  it('surfaces structured validation errors for contact submissions', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 'validation_error',
              message: 'Please correct the highlighted fields.',
              fields: { email: 'Please enter a valid email address.' },
            },
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      ),
    )

    await expect(
      submitContact({
        name: 'Patrick',
        email: 'bad',
        message: 'This message is definitely long enough.',
      }),
    ).rejects.toEqual(
      expect.objectContaining({
        code: 'validation_error',
        status: 400,
        fields: { email: 'Please enter a valid email address.' },
      }),
    )
  })
})

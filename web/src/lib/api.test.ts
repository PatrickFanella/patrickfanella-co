import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchProject, fetchProjects, getApiBaseUrl, submitContact } from './api'

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('returns the configured base url without a trailing slash', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:8181/')

    expect(getApiBaseUrl()).toBe('http://localhost:8181')
  })

  it('loads the same-origin project catalog independently of the contact API host', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com')
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
    expect(fetch).toHaveBeenCalledWith('/content/projects.json', undefined)
  })

  it('loads a single project by slug from the deployed catalog', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            items: [{
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
            }],
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

  it('returns a not-found error when a slug is absent from the catalog', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ items: [] }), { status: 200 })))
    await expect(fetchProject('missing')).rejects.toEqual(expect.objectContaining({ status: 404, code: 'project_not_found' }))
  })

  it('keeps contact submissions on the configured API host', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com/')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'Saved' }), { status: 201 })))
    await submitContact({ name: 'Pat', email: 'pat@example.com', message: 'A role to discuss.' })
    expect(fetch).toHaveBeenCalledWith('https://api.example.com/api/contact', expect.objectContaining({ method: 'POST' }))
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

  it('uses a plain connection error when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))

    await expect(fetchProjects()).rejects.toEqual(
      expect.objectContaining({ code: 'network_error', message: 'Connection failed.', status: 0 }),
    )
  })

  it('uses a plain request error when an error response has no message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: { code: 'internal_error' } }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    await expect(fetchProjects()).rejects.toEqual(
      expect.objectContaining({ code: 'internal_error', message: 'The request failed. Please try again.', status: 500 }),
    )
  })

  it('uses a request error when an error response contains HTML', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('<html>Bad gateway</html>', { status: 502 })),
    )

    await expect(fetchProjects()).rejects.toEqual(
      expect.objectContaining({
        code: 'unknown_error',
        message: 'The request failed. Please try again.',
        status: 502,
      }),
    )
  })

  it('uses a request error when an error response has an empty body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 503 })))

    await expect(fetchProjects()).rejects.toEqual(
      expect.objectContaining({
        code: 'unknown_error',
        message: 'The request failed. Please try again.',
        status: 503,
      }),
    )
  })
})

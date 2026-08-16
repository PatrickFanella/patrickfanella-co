export type ProjectMedia = {
  src: string
  srcSet?: string
  alt: string
  caption?: string
}

type ProjectKind = 'case-study' | 'highlight' | 'tool'
type ProjectClassification = 'flagship' | 'experiment' | 'archive'

export type Project = {
  slug: string
  title: string
  kind: ProjectKind
  classification: ProjectClassification
  category: string
  deliveryStatus: string
  periodLabel: string
  summary: string
  description: string
  problem: string
  role: string
  year: number
  stack: string[]
  featured: boolean
  repoUrl?: string
  liveUrl?: string
  highlights: string[]
  architecture: string[]
  lessons: string[]
  media: ProjectMedia[]
}

type ProjectListResponse = {
  items: Project[]
}

type ProjectDetailResponse = {
  item: Project
}

type ContactInput = {
  name: string
  email: string
  message: string
  website?: string
}

export type ContactSubmissionResponse = {
  message: string
}

type ApiErrorPayload = {
  error?: {
    code?: string
    message?: string
    fields?: Record<string, string>
  }
}

export class ApiClientError extends Error {
  status: number
  code: string
  fields?: Record<string, string>

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.code = code
    this.fields = fields
  }
}

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError
}

export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL?.trim() || '').replace(/\/$/, '')
}

export async function fetchProjects(): Promise<Project[]> {
  const payload = await request<ProjectListResponse>('/api/projects')
  return payload.items
}

export async function fetchProject(slug: string): Promise<Project> {
  const payload = await request<ProjectDetailResponse>(`/api/projects/${encodeURIComponent(slug)}`)
  return payload.item
}

export async function submitContact(input: ContactInput): Promise<ContactSubmissionResponse> {
  return request<ContactSubmissionResponse>('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, init)
  } catch {
    throw new ApiClientError(0, 'network_error', 'The API is not reachable right now.')
  }

  const payload = await parseJson<ApiErrorPayload | T>(response)

  if (!response.ok) {
    throw toApiClientError(response.status, payload as ApiErrorPayload | null)
  }

  return payload as T
}

async function parseJson<T>(response: Response): Promise<T | null> {
  const text = await response.text()
  if (!text) {
    return null
  }

  return JSON.parse(text) as T
}

function toApiClientError(status: number, payload: ApiErrorPayload | null): ApiClientError {
  const code = payload?.error?.code || 'unknown_error'
  const message = payload?.error?.message || 'Something went wrong while talking to the API.'
  const fields = payload?.error?.fields

  return new ApiClientError(status, code, message, fields)
}

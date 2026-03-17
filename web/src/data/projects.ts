export type Project = {
  slug: string
  title: string
  summary: string
  description: string
  role: string
  year: string
  stack: string[]
  featured: boolean
  highlights: string[]
  links: {
    live?: string
    repo?: string
  }
}

export const projects: Project[] = [
  {
    slug: 'case-study-one',
    title: 'Case Study One',
    summary:
      'Starter slot for a strong project story with a clear product problem, polished UI, and thoughtful trade-offs.',
    description:
      'Replace this with one of your strongest projects and expand it into a narrative that explains the challenge, your decisions, and the outcome.',
    role: 'Full stack developer',
    year: '2026',
    stack: ['React', 'TypeScript', 'Go', 'PostgreSQL'],
    featured: true,
    highlights: ['Project framing', 'Architecture rationale', 'Delivery outcomes'],
    links: {},
  },
  {
    slug: 'case-study-two',
    title: 'Case Study Two',
    summary:
      'Ideal placeholder for a visually stronger build, redesign, dashboard, or interaction-heavy frontend project.',
    description:
      'Use this entry for a project that shows design sensitivity, UI systems thinking, or front-to-back integration work.',
    role: 'Frontend / product engineer',
    year: '2025',
    stack: ['React', 'Vite', 'Design systems'],
    featured: true,
    highlights: ['Responsive UI', 'Interaction polish', 'Component architecture'],
    links: {},
  },
  {
    slug: 'case-study-three',
    title: 'Case Study Three',
    summary:
      'Reserved for a backend-heavy or API-focused build that reinforces your practical full-stack range.',
    description:
      'Swap in a data, automation, or service-oriented project that lets you talk about architecture and implementation details with confidence.',
    role: 'Backend / full stack developer',
    year: '2024',
    stack: ['Go', 'REST APIs', 'PostgreSQL'],
    featured: false,
    highlights: ['Data modeling', 'API design', 'Operational thinking'],
    links: {},
  },
]

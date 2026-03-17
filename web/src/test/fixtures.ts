import type { ContactSubmissionResponse, Project } from '../lib/api'

export const featuredProject: Project = {
	slug: 'patrickfanella-co',
	title: 'Patrick Fanella Portfolio',
	summary: 'Project-first portfolio platform backed by a typed React + Go stack.',
	description: 'Detailed portfolio case study content for the featured route.',
	role: 'Full stack developer',
	year: 2026,
	stack: ['React', 'TypeScript', 'Go', 'PostgreSQL'],
	featured: true,
	repoUrl: 'https://github.com/PatrickFanella/patrickfanella-co',
	highlights: ['Shared API contract', 'Seeded PostgreSQL content', 'E2E smoke path'],
}

export const archivedProject: Project = {
	slug: 'unique-id-rotating-logger',
	title: 'Unique ID Rotating Logger',
	summary: 'Backend logging utility with rotation and gzip retention.',
	description: 'Detailed archive entry content for a backend utility project.',
	role: 'Backend developer',
	year: 2021,
	stack: ['Node.js', 'Express', 'Logging'],
	featured: false,
	repoUrl: 'https://github.com/PatrickFanella/Unique-ID-Rotating-Logger',
	highlights: ['Unique request identifiers', 'Rotating logs', 'Compressed archives'],
}

export const projectsFixture: Project[] = [featuredProject, archivedProject]

export const contactSubmissionFixture: ContactSubmissionResponse = {
	message: 'Thanks — your note has been saved.',
	item: {
		id: 7,
		name: 'Patrick Fanella',
		email: 'patrick@example.com',
		message: 'I would love to talk about one of your featured case studies.',
		createdAt: '2026-03-17T00:00:00Z',
	},
}

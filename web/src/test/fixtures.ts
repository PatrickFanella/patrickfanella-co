import type { ContactSubmissionResponse, Project } from '../lib/api'

export const featuredProject: Project = {
	slug: 'clpr',
	title: 'Clpr',
	summary: 'Full-stack Twitch clip curation platform with community voting, hybrid search, and a React Native mobile app — deployed to production at clpr.tv.',
	description: 'Clpr started as a way to surface the best Twitch clips without relying on platform algorithms.',
	role: 'Full stack developer',
	year: 2025,
	stack: ['Go', 'React', 'React Native', 'PostgreSQL', 'Redis', 'OpenSearch', 'Kubernetes', 'TypeScript'],
	featured: true,
	repoUrl: 'https://github.com/subculture-collective/clpr',
	liveUrl: 'https://clpr.tv',
	highlights: [
		'Shipped a production web and mobile client with community voting, collections, and hybrid BM25 + semantic vector search.',
		'Built a Go API layer handling auth, content moderation, and real-time feed composition.',
		'Deployed to a VPS with Kubernetes orchestration, Prometheus/Grafana monitoring, and automated CI/CD.',
	],
	architecture: [
		'Go API with Gin serving both the React web client and the React Native Expo mobile app through a shared JSON contract.',
		'Hybrid search pipeline combining OpenSearch BM25 full-text scoring with semantic vector embeddings.',
	],
	lessons: [
		'Hybrid search is worth the infrastructure cost.',
		'Running a mobile and web client against the same API forced cleaner contract discipline early.',
	],
	media: [
		{
			src: '/assets/projects/clpr-overview.svg',
			alt: 'Architecture diagram showing the Clpr platform stack.',
			caption: 'Full platform architecture spanning web, mobile, and search infrastructure.',
		},
	],
}

export const archivedProject: Project = {
	slug: 'internet-id',
	title: 'Internet-ID',
	summary: 'Content provenance system anchoring creator ownership on-chain via Solidity smart contracts, IPFS storage, and a browser extension for one-click verification.',
	description: 'Internet-ID addresses content authenticity in the AI era.',
	role: 'Full stack developer',
	year: 2025,
	stack: ['Solidity', 'Next.js', 'TypeScript', 'IPFS', 'Express', 'PostgreSQL', 'Browser Extension', 'Web3'],
	featured: false,
	repoUrl: 'https://github.com/subculture-collective/internet-id',
	highlights: [
		'Designed a content provenance pipeline from hashing through IPFS to on-chain registration.',
		'Built a cross-browser extension for one-click ownership verification.',
		'Passed Slither security audits on the ContentRegistry smart contract.',
	],
	architecture: ['Solidity ContentRegistry contract on L2 with Hardhat + TypeScript toolchain.'],
	lessons: ['IPFS pinning reliability varies significantly across providers.'],
	media: [
		{
			src: '/assets/projects/internet-id-overview.svg',
			alt: 'Flow diagram showing content provenance pipeline.',
			caption: 'Content provenance pipeline from creator signing through on-chain anchoring.',
		},
	],
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

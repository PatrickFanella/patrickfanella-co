import type { ContactSubmissionResponse, Project } from '../lib/api'

export const featuredProject: Project = {
	slug: 'clpr',
	title: 'Clpr',
	summary: 'Full-stack Twitch clip curation platform with community voting, hybrid search, and a React Native mobile app — live in production at clpr.tv.',
	description: 'Clpr started as a way to surface the best Twitch clips without relying on platform algorithms.',
	role: 'Full-stack engineer',
	year: 2025,
	stack: ['Go', 'React', 'React Native', 'PostgreSQL', 'Redis', 'OpenSearch', 'Kubernetes', 'TypeScript'],
	featured: true,
	repoUrl: 'https://github.com/subculture-collective/clpr',
	liveUrl: 'https://clpr.tv',
	highlights: [
		'Shipped a production web and mobile client with community voting, collections, and hybrid BM25 + semantic vector search.',
		'Built a Go API layer handling auth, content moderation, and real-time feed composition across PostgreSQL, Redis, and OpenSearch.',
		'Deployed to a VPS with Kubernetes orchestration, Prometheus/Grafana monitoring, and automated CI/CD through GitHub Actions.',
	],
	architecture: [
		'Go API with Gin serving both the React web client and the React Native Expo mobile app through a shared JSON contract.',
		'Hybrid search pipeline combining OpenSearch BM25 full-text scoring with semantic vector embeddings for relevance ranking.',
	],
	lessons: [
		'Hybrid search is worth the infrastructure cost — users consistently found clips that pure text search missed.',
		'Running a mobile and web client against the same API forced cleaner contract discipline early.',
	],
	media: [
		{
			src: '/assets/projects/clpr-overview.svg',
			alt: 'Architecture diagram showing the Clpr platform stack: Go API, React web, React Native mobile, PostgreSQL, Redis, and OpenSearch.',
			caption: 'Full platform architecture spanning web, mobile, and search infrastructure.',
		},
	],
}

export const archivedProject: Project = {
	slug: 'internet-id',
	title: 'Internet-ID',
	summary: 'Content provenance system anchoring creator ownership on-chain via Solidity smart contracts, IPFS storage, and a browser extension for one-click verification.',
	description: 'Content authenticity is collapsing in the AI era.',
	role: 'Full-stack engineer',
	year: 2025,
	stack: ['Solidity', 'Next.js', 'TypeScript', 'IPFS', 'Express', 'PostgreSQL', 'Browser Extension', 'Web3'],
	featured: false,
	repoUrl: 'https://github.com/subculture-collective/internet-id',
	highlights: [
		'Designed a content provenance pipeline: hash content, sign a manifest, pin to IPFS, and register the claim on-chain through a Solidity smart contract on L2.',
		'Built a cross-browser extension (Chrome, Firefox, Safari) for one-click ownership verification directly on YouTube and Twitter pages.',
		'Passed Slither security audits on the ContentRegistry smart contract and met WCAG 2.1 AA accessibility standards on the frontend.',
	],
	architecture: ['Solidity ContentRegistry contract on L2 with Hardhat + TypeScript toolchain, Ethers v6 integration, and Slither static analysis for security auditing.'],
	lessons: ['IPFS pinning reliability varies significantly across providers — abstracting behind Infura, Web3.Storage, and Pinata with automatic failover was necessary for production trust.'],
	media: [
		{
			src: '/assets/projects/internet-id-overview.svg',
			alt: 'Flow diagram showing content hashing, IPFS storage, on-chain registration, and browser extension verification.',
			caption: 'Content provenance pipeline from creator signing through on-chain anchoring to browser-based verification.',
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

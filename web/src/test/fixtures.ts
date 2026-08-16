import type { ContactSubmissionResponse, Project } from '../lib/api'

export const featuredProject: Project = {
	slug: 'clpr',
	title: 'Clpr',
	kind: 'case-study',
	classification: 'flagship',
	category: 'Community & Media',
	deliveryStatus: 'Production',
	periodLabel: '2025–present',
	summary: 'Full-stack Twitch clip curation platform with community voting, hybrid search, and a React Native mobile app, live in production at clpr.tv.',
	description: 'Clpr started as a way to surface the best Twitch clips without relying on platform algorithms.',
	problem: 'Twitch clips vanish into search-resistant archives the moment a stream ends. Communities have no dependable way to vote, organize, discuss, or find the moments that mattered.',
	role: 'Full-stack engineer',
	year: 2025,
	stack: ['Go', 'React', 'React Native', 'PostgreSQL', 'Redis', 'OpenSearch', 'Kubernetes', 'TypeScript'],
	featured: true,
	repoUrl: 'https://git.subcult.tv/subculture-collective/clpr',
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
		'Hybrid search is worth the infrastructure cost; users consistently found clips that pure text search missed.',
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
	kind: 'case-study',
	classification: 'archive',
	category: 'Data & Search',
	deliveryStatus: 'Archive',
	periodLabel: '2025',
	summary: 'Content provenance system anchoring creator ownership on-chain via Solidity smart contracts, IPFS storage, and a browser extension for one-click verification.',
	description: 'Content authenticity is collapsing in the AI era.',
	problem: 'Creators need to prove content ownership without trusting a centralized platform with their original work.',
	role: 'Full-stack engineer',
	year: 2025,
	stack: ['Solidity', 'Next.js', 'TypeScript', 'IPFS', 'Express', 'PostgreSQL', 'Browser Extension', 'Web3'],
	featured: false,
	repoUrl: 'https://git.subcult.tv/subculture-collective/internet-id',
	highlights: [
		'Designed a content provenance pipeline: hash content, sign a manifest, pin to IPFS, and register the claim on-chain through a Solidity smart contract on L2.',
		'Built a cross-browser extension (Chrome, Firefox, Safari) for one-click ownership verification directly on YouTube and Twitter pages.',
		'Passed Slither security audits on the ContentRegistry smart contract and met WCAG 2.1 AA accessibility standards on the frontend.',
	],
	architecture: ['Solidity ContentRegistry contract on L2 with Hardhat + TypeScript toolchain, Ethers v6 integration, and Slither static analysis for security auditing.'],
	lessons: ['IPFS pinning reliability varies significantly across providers; abstracting behind Infura, Web3.Storage, and Pinata with automatic failover was necessary for production trust.'],
	media: [
		{
			src: '/assets/projects/internet-id-overview.svg',
			alt: 'Flow diagram showing content hashing, IPFS storage, on-chain registration, and browser extension verification.',
			caption: 'Content provenance pipeline from creator signing through on-chain anchoring to browser-based verification.',
		},
	],
}

export const toolProject: Project = {
	slug: 'tmux-popups',
	title: 'tmux-popups',
	kind: 'tool',
	classification: 'archive',
	category: 'Developer Tools',
	deliveryStatus: 'Tool',
	periodLabel: '2026',
	summary: 'Developer utility for opening tmux popup panes quickly, keeping terminal side quests and scratch workflows out of the main window.',
	description: 'A small tmux helper for launching popup panes for quick commands, notes, and short-lived shell tasks.',
	problem: 'Terminal side quests deserve their own space. Tmux Popups keeps quick commands and scratch work in a popup pane instead of cluttering the main session.',
	role: 'Developer tool',
	year: 2026,
	stack: ['Shell', 'tmux', 'CLI', 'Automation'],
	featured: false,
	repoUrl: 'https://git.subcult.tv/PatrickFanella/tmux-popups',
	highlights: [
		'Wrapped common tmux popup workflows into a tiny helper so transient shell tasks stay lightweight and predictable.',
	],
	architecture: [],
	lessons: [],
	media: [],
}

export const projectsFixture: Project[] = [featuredProject, archivedProject, toolProject]

export const contactSubmissionFixture: ContactSubmissionResponse = {
	message: 'Thanks. Your note has been saved.',
}

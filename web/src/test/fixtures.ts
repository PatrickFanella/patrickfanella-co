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
	coreMechanism: 'Hybrid BM25 and vector search pipeline with versioned Go API',
	shippedOutcome: 'Multi-platform clip discovery and moderation platform',
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
	slug: 'subcorp',
	title: 'Subcorp',
	kind: 'case-study',
	classification: 'archive',
	selected: false,
	category: 'AI & Automation',
	deliveryStatus: 'Archive',
	periodLabel: '2026',
	summary: 'A self-hosted platform where six named agents propose, debate, and run missions through real-time chat and sandboxed tools.',
	description: 'Distinct agent identities, ordered messages, and bounded tools support a shared workspace.',
	problem: 'Agents sharing tools and a chat room need clear identities and ordered messages.',
	coreMechanism: 'Autonomous multi-agent orchestration loop with bounded delegation',
	shippedOutcome: 'Self-hosted six-agent mission and chat platform',
	role: 'Lead full-stack engineer',
	year: 2026,
	stack: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
	featured: false,
	repoUrl: 'https://git.subcult.tv/subculture-collective/subcorp',
	highlights: ['Built a shared workspace with ordered agent messages.'],
	architecture: ['A WebSocket layer carries structured agent and user messages.'],
	lessons: ['Explicit identities and tool boundaries help keep simultaneous actions ordered.'],
	media: [],
	thumbnailUrl: '/assets/projects/covers/subcorp.svg',
	thumbnailAlt: 'Subcorp project identity',
}

export const toolProject: Project = {
	slug: 'tmux-popups',
	selected: true,
	title: 'tmux-popups',
	kind: 'tool',
	classification: 'archive',
	category: 'Developer Tools',
	deliveryStatus: 'Tool',
	periodLabel: '2026',
	summary: 'Developer utility for opening tmux popup panes quickly, keeping terminal side quests and scratch workflows out of the main window.',
	description: 'A small tmux helper for launching popup panes for quick commands, notes, and short-lived shell tasks.',
	problem: 'Terminal side quests deserve their own space. Tmux Popups keeps quick commands and scratch work in a popup pane instead of cluttering the main session.',
	coreMechanism: 'Terminal multiplexer integration with dynamic shell scratchpad spawning',
	shippedOutcome: 'Frictionless popup workflow tool for terminal developers',
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

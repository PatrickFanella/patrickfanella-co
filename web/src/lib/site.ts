export const siteName = 'Patrick Fanella'

export type AnalyticsConfig = {
	domain: string
	scriptUrl: string
}

export function getSiteUrl() {
	return (import.meta.env.VITE_SITE_URL?.trim() || 'https://patrickfanella.co').replace(/\/$/, '')
}

export function getAnalyticsConfig(): AnalyticsConfig | null {
	const domain = import.meta.env.VITE_ANALYTICS_PLAUSIBLE_DOMAIN?.trim() || ''
	if (!domain) {
		return null
	}

	return {
		domain,
		scriptUrl:
			import.meta.env.VITE_ANALYTICS_PLAUSIBLE_SCRIPT_URL?.trim() ||
			'https://plausible.io/js/script.file-downloads.outbound-links.js',
	}
}

export function toAbsoluteUrl(value?: string) {
	if (!value) {
		return undefined
	}

	return new URL(value, `${getSiteUrl()}/`).toString()
}

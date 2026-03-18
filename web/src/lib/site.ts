export const siteName = 'Patrick Fanella'

export function getSiteUrl() {
	return (import.meta.env.VITE_SITE_URL?.trim() || 'https://patrickfanella.co').replace(/\/$/, '')
}

export function toAbsoluteUrl(value?: string) {
	if (!value) {
		return undefined
	}

	return new URL(value, `${getSiteUrl()}/`).toString()
}

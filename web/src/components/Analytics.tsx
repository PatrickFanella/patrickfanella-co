import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { getAnalyticsConfig, getSiteUrl } from '../lib/site'

declare global {
	interface Window {
		plausible?: (eventName: string, options?: { u?: string; props?: Record<string, string> }) => void
		plausibleq?: Array<[string, { u?: string; props?: Record<string, string> }?]>
	}
}

const plausibleScriptId = 'plausible-analytics-script'

export function Analytics() {
	const location = useLocation()
	const config = getAnalyticsConfig()

	useEffect(() => {
		if (!config) {
			return
		}

		if (typeof window !== 'undefined' && typeof window.plausible !== 'function') {
			window.plausible = (eventName, options) => {
				window.plausibleq = window.plausibleq || []
				window.plausibleq.push([eventName, options])
			}
		}

		if (document.getElementById(plausibleScriptId)) {
			return
		}

		const script = document.createElement('script')
		script.id = plausibleScriptId
		script.defer = true
		script.dataset.domain = config.domain
		script.dataset.manual = 'true'
		script.src = config.scriptUrl
		document.head.appendChild(script)

		return () => {
			script.remove()
		}
	}, [config])

	useEffect(() => {
		if (!config || typeof window === 'undefined') {
			return
		}

		window.plausible?.('pageview', {
			u: `${getSiteUrl()}${location.pathname}${location.search}${location.hash}`,
		})
	}, [config, location.hash, location.pathname, location.search])

	useEffect(() => {
		if (!config || typeof document === 'undefined' || typeof window === 'undefined') {
			return
		}

		const onClick = (event: MouseEvent) => {
			const target = event.target
			if (!(target instanceof Element)) {
				return
			}

			const link = target.closest('a[href]')
			if (!(link instanceof HTMLAnchorElement)) {
				return
			}

			let destination: URL
			try {
				destination = new URL(link.href, window.location.href)
			} catch {
				return
			}

			if (destination.origin === window.location.origin) {
				return
			}

			window.plausible?.('Outbound Link: Click', {
				props: {
					destination: destination.hostname,
				},
			})
		}

		document.addEventListener('click', onClick)
		return () => {
			document.removeEventListener('click', onClick)
		}
	}, [config])

	return null
}

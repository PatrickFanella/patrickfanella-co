import { Link } from 'react-router-dom'

import { RouteState } from '../components/RouteState'
import { Seo } from '../components/Seo'
import { pageSectionClass, primaryButtonClass } from '../lib/styles'

export function NotFoundPage() {
	return (
		<section className={`${pageSectionClass} pt-4`}>
			<Seo
				description="The requested page could not be found."
				includeCanonical={false}
				includeSocialUrl={false}
				robots="noindex,follow"
				title="Page not found"
			/>
			<RouteState
				actions={
					<Link className={primaryButtonClass} to="/">
						Back to Home
					</Link>
				}
				description="The page you requested does not exist or may have moved."
				headingLevel="h1"
				label="Not found"
				title="This page isn't available."
			/>
		</section>
	)
}

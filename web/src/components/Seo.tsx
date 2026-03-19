import { Helmet } from 'react-helmet-async'

import { siteName, toAbsoluteUrl } from '../lib/site'

const defaultTitle = `${siteName} | Full Stack Developer`
const defaultDescription =
	'Project-first portfolio for Patrick Fanella covering Go APIs, React interfaces, PostgreSQL, AI pipelines, and production systems.'
const defaultImagePath = '/assets/projects/project-fallback.svg'

type StructuredData = Record<string, unknown> | Array<Record<string, unknown>>

type SeoProps = {
	title?: string
	description?: string
	path?: string
	image?: string
	imageAlt?: string
	type?: 'article' | 'website'
	robots?: string
	includeCanonical?: boolean
	includeSocialUrl?: boolean
	structuredData?: StructuredData
}

export function Seo({
	title,
	description = defaultDescription,
	path = '/',
	image = defaultImagePath,
	imageAlt,
	type = 'website',
	robots = 'index,follow',
	includeCanonical = true,
	includeSocialUrl = true,
	structuredData,
}: SeoProps) {
	const resolvedTitle = title ? `${title} | ${siteName}` : defaultTitle
	const absoluteUrl = toAbsoluteUrl(path)
	const canonicalUrl = includeCanonical ? absoluteUrl : undefined
	const ogUrl = includeSocialUrl ? absoluteUrl : undefined
	const imageUrl = toAbsoluteUrl(image)
	const structuredEntries = structuredData
		? Array.isArray(structuredData)
			? structuredData
			: [structuredData]
		: []

	return (
		<Helmet prioritizeSeoTags>
			<title>{resolvedTitle}</title>
			<meta content={description} name="description" />
			<meta content={robots} name="robots" />
			<meta content="#282a36" name="theme-color" />
			<meta content={resolvedTitle} property="og:title" />
			<meta content={description} property="og:description" />
			<meta content={type} property="og:type" />
			<meta content={siteName} property="og:site_name" />
			{ogUrl ? <meta content={ogUrl} property="og:url" /> : null}
			{imageUrl ? <meta content={imageUrl} property="og:image" /> : null}
			{imageUrl && imageAlt ? <meta content={imageAlt} property="og:image:alt" /> : null}
			<meta content="summary_large_image" name="twitter:card" />
			<meta content={resolvedTitle} name="twitter:title" />
			<meta content={description} name="twitter:description" />
			{imageUrl ? <meta content={imageUrl} name="twitter:image" /> : null}
			{imageUrl && imageAlt ? <meta content={imageAlt} name="twitter:image:alt" /> : null}
			{canonicalUrl ? <link href={canonicalUrl} rel="canonical" /> : null}
			{structuredEntries.map((entry, index) => (
				<script key={index} type="application/ld+json">
					{JSON.stringify(entry)}
				</script>
			))}
		</Helmet>
	)
}

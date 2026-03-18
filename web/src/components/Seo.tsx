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
	type?: 'article' | 'website'
	robots?: string
	structuredData?: StructuredData
}

export function Seo({
	title,
	description = defaultDescription,
	path = '/',
	image = defaultImagePath,
	type = 'website',
	robots = 'index,follow',
	structuredData,
}: SeoProps) {
	const resolvedTitle = title ? `${title} | ${siteName}` : defaultTitle
	const canonicalUrl = toAbsoluteUrl(path)
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
			{canonicalUrl ? <meta content={canonicalUrl} property="og:url" /> : null}
			{imageUrl ? <meta content={imageUrl} property="og:image" /> : null}
			<meta content="summary_large_image" name="twitter:card" />
			<meta content={resolvedTitle} name="twitter:title" />
			<meta content={description} name="twitter:description" />
			{imageUrl ? <meta content={imageUrl} name="twitter:image" /> : null}
			{canonicalUrl ? <link href={canonicalUrl} rel="canonical" /> : null}
			{structuredEntries.map((entry, index) => (
				<script key={index} type="application/ld+json">
					{JSON.stringify(entry)}
				</script>
			))}
		</Helmet>
	)
}

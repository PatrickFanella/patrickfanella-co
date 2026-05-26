import { Helmet } from 'react-helmet-async'

interface Props {
  title: string
  description?: string
  canonical?: string
}

export function SEO({ title, description, canonical }: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  )
}

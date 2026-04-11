import { Helmet } from 'react-helmet-async'

const BASE_URL = 'https://shineonyou.no'
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/Banner Web.png`

export default function SEO({ title, description, canonicalPath = '/', ogImage }) {
  const fullTitle = title
    ? `${title} | Shine On You`
    : 'Shine On You – Pink Floyd Tribute Band'

  const canonical = `${BASE_URL}${canonicalPath}`
  const image = ogImage || DEFAULT_OG_IMAGE

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Shine On You" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}

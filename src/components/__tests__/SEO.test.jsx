// react-helmet-async pirker i React-internals og er derfor det første som
// ryker på en react/react-dom-bump. Taggene den skriver er samtidig usynlige
// i nettleseren, så en stille ødeleggelse her koster oss delingsbilder og
// canonical-er uten at noen ser det før Google gjør det.
import { render, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import SEO from '../SEO'
import { OG_IMAGE } from '../../config/branding'

const renderSEO = (props) =>
  render(<HelmetProvider><SEO {...props} /></HelmetProvider>)

const meta = (selector) => document.head.querySelector(selector)?.getAttribute('content')

test('skriver tittel, beskrivelse og canonical til head', async () => {
  renderSEO({
    title: 'Press',
    description: 'Logoer og pressebilder.',
    canonicalPath: '/press',
  })

  await waitFor(() => {
    expect(document.title).toBe('Press | Shine On You')
  })
  expect(meta('meta[name="description"]')).toBe('Logoer og pressebilder.')
  expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href'))
    .toBe('https://shineonyou.no/press')
})

test('uten tittel brukes bandnavnet alene, ikke « | Shine On You»', async () => {
  renderSEO({ description: 'Pink Floyd tribute.' })

  await waitFor(() => {
    expect(document.title).toBe('Shine On You – Pink Floyd Tribute Band')
  })
})

test('og- og twitter-taggene får absolutt bilde-URL', async () => {
  renderSEO({ title: 'Press', description: 'Logoer.', canonicalPath: '/press' })

  await waitFor(() => {
    expect(meta('meta[property="og:image"]')).toBe(`https://shineonyou.no${OG_IMAGE}`)
  })
  expect(meta('meta[name="twitter:image"]')).toBe(`https://shineonyou.no${OG_IMAGE}`)
  expect(meta('meta[property="og:url"]')).toBe('https://shineonyou.no/press')
  expect(meta('meta[property="og:title"]')).toBe('Press | Shine On You')
  expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image')
})

test('eksplisitt ogImage overstyrer standardbildet', async () => {
  renderSEO({
    title: 'Galleri',
    description: 'Bilder.',
    canonicalPath: '/gallery',
    ogImage: 'https://shineonyou.no/bilder/konsert.jpg',
  })

  await waitFor(() => {
    expect(meta('meta[property="og:image"]')).toBe('https://shineonyou.no/bilder/konsert.jpg')
  })
})

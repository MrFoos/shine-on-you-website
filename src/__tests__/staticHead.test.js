// Delingstaggene i index.html er de eneste Facebook, LinkedIn og Slack ser —
// de kjører ikke JavaScript. De er skrevet for hånd og kan derfor stille gli
// fra OG_IMAGE i branding.js ved neste logobytte.
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { OG_IMAGE } from '../config/branding'

const root = resolve(__dirname, '..', '..')
const head = new DOMParser()
  .parseFromString(readFileSync(resolve(root, 'index.html'), 'utf8'), 'text/html').head

const meta = (selector) => head.querySelector(selector)?.getAttribute('content')

test('statisk delingsbilde følger OG_IMAGE og finnes på disk', () => {
  expect(meta('meta[property="og:image"]')).toBe(`https://shineonyou.no${OG_IMAGE}`)
  expect(meta('meta[name="twitter:image"]')).toBe(`https://shineonyou.no${OG_IMAGE}`)
  expect(existsSync(resolve(root, 'public', `.${OG_IMAGE}`))).toBe(true)
})

test('oppgitt bildestørrelse stemmer med PNG-filen', () => {
  // Bredde og høyde ligger som big-endian uint32 på byte 16 og 20 i IHDR.
  const png = readFileSync(resolve(root, 'public', `.${OG_IMAGE}`))
  expect(meta('meta[property="og:image:width"]')).toBe(String(png.readUInt32BE(16)))
  expect(meta('meta[property="og:image:height"]')).toBe(String(png.readUInt32BE(20)))
})

test('har tittel, beskrivelse og stort kort, men ikke og:url', () => {
  expect(meta('meta[property="og:title"]')).toBe('Shine On You – Pink Floyd Tribute Band')
  expect(meta('meta[property="og:description"]')).toBe(meta('meta[name="description"]'))
  expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image')
  // index.html serveres for alle ruter; en fast og:url ville pekt /tour til forsiden.
  expect(head.querySelector('meta[property="og:url"]')).toBeNull()
})

test('alle statiske delingstagger er merket slik at main.jsx kan fjerne dem', () => {
  const social = [...head.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]')]
  expect(social.length).toBeGreaterThan(0)
  expect(social.every((el) => el.hasAttribute('data-static-social'))).toBe(true)
})

/**
 * Post-build script: skriver dist/press/index.html.
 *
 * Siten er en SPA der alle ruter serveres fra én index.html, så `noindex` fra
 * react-helmet finnes bare etter at JavaScript har kjørt. Crawlere som ikke
 * kjører JS ser i stedet det statiske fallbacket fra generate-static.js — altså
 * forsidens innhold, uten noindex.
 *
 * nginx prøver `$uri/` før SPA-fallbacket (verifisert: /images/ svarer 403, ikke
 * forsiden), så en ekte fil på press/index.html blir servert for /press. Den er
 * identisk med dist/index.html bortsett fra to ting: robots-taggen ligger i
 * markup, og forsidefallbacket er tatt ut.
 *
 * Merk at dette bare dekker selve siden. Filene under /press/logo/ er ikke
 * beskyttet av en meta-tagg — det krever `X-Robots-Tag` fra nginx, se
 * BRANDING.md.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '..', 'dist')

let html = readFileSync(resolve(dist, 'index.html'), 'utf8')

const ROBOTS = '<meta name="robots" content="noindex, nofollow" />'

// Uten robots-taggen er hele filen poengløs, så feil her skal stoppe bygget.
if (!html.includes('<head>')) {
  throw new Error('[generate-press-html] fant ikke <head> i dist/index.html')
}
html = html.replace('<head>', `<head>\n    ${ROBOTS}`)

// Forsidens fallback-innhold hører ikke hjemme på press-siden.
html = html.replace(/<div id="static-fallback"[\s\S]*?<\/div>\s*(?=<\/div>)/, '')

mkdirSync(resolve(dist, 'press'), { recursive: true })
writeFileSync(resolve(dist, 'press', 'index.html'), html, 'utf8')
console.log('[generate-press-html] dist/press/index.html skrevet.')

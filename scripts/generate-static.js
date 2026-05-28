/**
 * Pre-build script: generates llms.txt and injects a static HTML fallback
 * into index.html so crawlers without JS see meaningful content.
 *
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the environment
 * (same secrets used by the main Vite build).
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[generate-static] Missing Supabase env vars — skipping static generation.')
  process.exit(0)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const today = new Date().toISOString().split('T')[0]

const { data: events } = await supabase
  .from('events')
  .select('date, venue, city, country, ticket_url, ticket_status')
  .gte('date', today)
  .eq('is_history', false)
  .order('date', { ascending: true })
  .limit(10)

const upcoming = events ?? []

// ── llms.txt ────────────────────────────────────────────────────────────────

const concertLines = upcoming.length
  ? upcoming.map((e) => {
      const d = new Date(e.date)
      const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      return `- ${label}: ${e.venue}, ${e.city}, ${e.country}`
    }).join('\n')
  : '(No upcoming concerts scheduled at this time.)'

const llmsTxt = `# Shine On You

## About
Shine On You is a Norwegian Pink Floyd tribute band, founded in 2017.
The band performs the full spectrum of Pink Floyd's catalogue — from
The Dark Side of the Moon and The Wall to Wish You Were Here and
Shine On You Crazy Diamond — with a ten-piece line-up including
full light show and visual production.

## Repertoire highlights
- The Dark Side of the Moon (full album)
- The Wall (selected songs)
- Wish You Were Here
- Shine On You Crazy Diamond
- Comfortably Numb, Money, Another Brick in the Wall, Time, and more

## Upcoming concerts
${concertLines}

## Booking
Booking inquiries: see https://shineonyou.no/book

## Social media
- Facebook: https://www.facebook.com/shineonyouband
- Instagram: https://www.instagram.com/shineonyouband
- YouTube: https://www.youtube.com/@shineonyouband

## Website
https://shineonyou.no
`

writeFileSync(resolve(root, 'public', 'llms.txt'), llmsTxt, 'utf8')
console.log('[generate-static] public/llms.txt written.')

// ── index.html static fallback ───────────────────────────────────────────────

const concertHtml = upcoming.length
  ? `<ul>${upcoming.slice(0, 5).map((e) => {
      const d = new Date(e.date)
      const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      return `<li>${label} — ${e.venue}, ${e.city}, ${e.country}</li>`
    }).join('')}</ul>`
  : '<p>No upcoming concerts scheduled.</p>'

const staticFallback = `<div id="static-fallback" aria-hidden="true" style="display:none">
  <h1>Shine On You – Pink Floyd Tribute Band</h1>
  <p>Norway's premier Pink Floyd tribute band. Performing classics from
  The Dark Side of the Moon, The Wall and Wish You Were Here live across
  Norway, Sweden and Scandinavia.</p>
  <h2>Upcoming concerts</h2>
  ${concertHtml}
  <p>Full tour dates and tickets: <a href="https://shineonyou.no/tour">shineonyou.no/tour</a></p>
</div>`

const indexPath = resolve(root, 'index.html')
let indexHtml = readFileSync(indexPath, 'utf8')

// Replace or insert static fallback inside #root
indexHtml = indexHtml.replace(
  /<div id="root">[\s\S]*?<\/div>/,
  `<div id="root">${staticFallback}</div>`
)

writeFileSync(indexPath, indexHtml, 'utf8')
console.log('[generate-static] index.html static fallback injected.')

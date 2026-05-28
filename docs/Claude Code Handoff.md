# Shine On You — Redesign Handoff

This document defines the redesign work for `shineonyou.no` in three independent
phases (= three PRs). Each phase can be reviewed and merged on its own.

Source of truth for visual decisions: `Homepage Designs.html` in the design project.
Final selected variant: **B · No videos, with optional background image**.

Repo conventions (from `CLAUDE.md`):
- Always work on a feature branch — never push directly to `main`.
- One PR per phase. Phases can be parallel branches off `main`.
- Plans go in `~/.claude/plans/` with `<!-- project: shine-on-you-website -->`
  frontmatter and a status marker.

---

## Decisions locked in (do not re-litigate)

- **Language: English only.** No Norwegian/Swedish localization. Skipped because
  it would require admin-editable per-locale content — too large a refactor.
- **No newsletter** in this round.
- **No setlist/repertoire page** in this round.
- **No FAQ page or section** in this round.
- **No moving away from CSR.** Instead, ensure JSON-LD covers what crawlers and AI
  assistants need to read.
- **No plain-text email anywhere.** Booking is `mailto:` only until phase 3
  introduces a form.
- **Homepage layout: no videos on the homepage** — the dedicated `/videos` page
  is enough. Hero is the dominant element with optional background photo.

---

## Phase 1 — Technical quick wins (PR #1)

Goal: ship every "under-the-hood" improvement from the analysis, without
touching the homepage layout or the logo. This phase alone should already lift
the site noticeably on SEO and AI-discovery.

### Tasks

1. **MusicEvent JSON-LD on `/tour`**
   - Generate `<script type="application/ld+json">` from the Supabase
     `events` rows, one `MusicEvent` per row.
   - Required fields: `@type: MusicEvent`, `name`, `startDate`, `location`
     (Place with name + address), `performer` (referencing the MusicGroup),
     `eventStatus`, `eventAttendanceMode`, `offers` (URL to ticket page,
     availability based on `ticket_status`).
   - Emit on `/tour` for sure, and also embed the **next upcoming event**
     on `/` so the homepage carries one MusicEvent too.

2. **Person JSON-LD on `/about`**
   - One `Person` per band member (from `members` table). Fields: `name`,
     `image` (Supabase storage URL), `memberOf` referencing the MusicGroup.

3. **VideoObject JSON-LD on `/videos`**
   - One `VideoObject` per video (from the `videos` table). Fields:
     `name`, `embedUrl` (YouTube), `thumbnailUrl`, `uploadDate` if known.

4. **Unique meta description per page** ✅ Done.
   - Shipped copy:
     - `/` — "Shine On You is Scandinavia's premier Pink Floyd tribute band.
       Performing classics from The Dark Side of the Moon, The Wall and Wish
       You Were Here and more."
     - `/tour` — "Upcoming Shine On You concerts. Tour dates, venues and
       ticket links."
     - `/about` — "Meet the musicians behind Shine On You, Scandinavia's
       leading Pink Floyd tribute band."
     - `/gallery` — "Photos from Shine On You live concerts — lights, stage,
       backstage, audience."
     - `/videos` — "Live recordings of Shine On You performing Pink Floyd
       classics."
   - "Scandinavia's premier" applied in `index.html` `<meta name="description">`,
     `Home.jsx` `BASE_SCHEMA.description`, and `Home.jsx` `<SEO description>`.

5. **Replace `llms.txt`**
   - Currently contains "Stop Claude". Replace with structured content:
     band name, short bio, repertoire highlights, upcoming concerts list,
     booking contact (no plain-text email — use a sentence like
     "Booking inquiries: see shineonyou.no/book"), socials.
   - Regenerate the upcoming-concerts portion at build time so it stays fresh.
     Acceptable to lag by one deploy.

6. **Alt-texts for gallery images**
   - Add a `caption` (or `alt_text`) column to the `gallery_images` table in
     Supabase.
   - Surface the field in the Galleri admin tab so the band can fill them.
   - Render as `<img alt={...}>`. Fallback: still render the filename if empty,
     but warn in admin that empty alt-texts hurt SEO/accessibility.

7. **Clean up language inconsistency in events**
   - **Scope: admin-entered data only.** The codebase is already consistent —
     all source uses "Norway"/"Sweden" in English. The mixed values come from
     hand-entered rows in the events table via the admin panel.
   - Action: a one-off migration on the `events` table that normalises
     `country` values to canonical English ("Norway", "Sweden", "Denmark",
     etc). List the rows to be touched in the PR description.
   - To prevent regression: the Events admin form's country input now has
     `placeholder="e.g. Norway"` and a label hint `(English, e.g. Norway)`
     to guide consistent English input. Free text is retained for flexibility.

8. **Static fallback content in `index.html`**
   - Since we're keeping CSR, inject some static HTML into `<div id="root">`
     so crawlers that don't run JS see *something*: band name, one-line
     description, and a short list of upcoming concerts (generated at build).
   - React will replace it on hydration. No flicker because the static and
     hydrated content match.

### Out of scope for this phase
- Homepage redesign (phase 2)
- New logo (phase 2)
- Book Us page (phase 3)

### Acceptance criteria
- Google's Rich Results Test passes for `/`, `/tour`, `/about`, `/videos`.
- No regression on the existing English page copy.
- No new admin features required, except: alt-text field on gallery items
  and (optionally) a country-suggestion dropdown on the event form.

---

## Phase 2 — New logo + homepage redesign (PR #2)

Goal: replace the old `Banner Web.png` logo and ship the new homepage.

### Asset bundle (already in the design project)
- `assets/logo-full.png` — full logo (wordmark + prism + rainbow), 5367×2853,
  black background baked in (opaque PNG, suitable for solid-black surfaces).
  Use for the hero.
- `assets/logo-wordmark.png` — wordmark only, 3854×2445, also black bg.
  Use for the nav bar and any tight space.
- Copy both into `shine-on-you-website/public/images/`.
- Also generate:
  - `favicon.ico` and `favicon-32x32.png` / `favicon-16x16.png` — crop of the
    prism mark only (the triangle + rainbow stripes), square, on solid black.
  - `apple-touch-icon.png` (180×180) — same prism crop.
  - `og-image.png` (1200×630) — full logo centered on solid black.

### Tasks

1. **Swap the logo everywhere**
   - `<Header>` no longer renders `Banner Web.png`. Delete that file from `public/images/`.
   - Nav (`Nav.jsx`) gets a small `logo-wordmark.png` at `height: 28px` on the left,
     replacing the (currently absent) brand mark.
   - `index.html`: update `<link rel="icon">` to the new favicon set.
   - `<meta property="og:image">`: point to the new `og-image.png`.

2. **New homepage layout** (replace contents of `Home.jsx`)

   Page structure, top to bottom:
   - `<Nav />` (existing, with the new logo added on the left)
   - **Hero** (new component, `Hero.jsx`):
     - Optional full-bleed background image with dark overlay (see Forsiden
       admin spec below).
     - Eyebrow: red, all-caps, letter-spaced. Default: "Pink Floyd Tribute · Est. 2017".
     - Logo (`logo-full.png`) at ~240px height (responsive: scales down on mobile).
     - Tagline (one sentence). Default: "A powerful tribute to one of the
       greatest bands in music history."
     - Two CTAs: primary (filled red) → `/tour`; secondary (white outline) →
       `mailto:shineonyouband@gmail.com?subject=Booking%20inquiry`.
     - Right-hand floating card: see **Next Show / Between Tours** logic below.
     - Hero height: 820px desktop, scales down on mobile.
   - **Social strip** (new component, `SocialStrip.jsx`):
     - "FOLLOW US" kicker, centered.
     - 3 white SVG icons (Facebook, Instagram, YouTube) at 34px, 28px gap,
       centered, no rings.
     - Padding: 140px top/bottom desktop.
   - **Footer**: collapse to one line, centered. Just `© {year} Shine On You DA
     · Org.nr 922 087 857`. The current `<SocialMedia>` component is moved
     into the new Social strip and no longer rendered in the footer.

3. **Next Show card / Between Tours empty state**
   - On `Home.jsx` mount, query: events where `date >= today AND is_history = false`,
     ordered ascending, limit 1.
   - If a row exists → render `<NextShowCard event={...} />` with date block,
     city/country, venue name, and a red-outline "Tickets →" link to
     `event.ticket_url`.
   - If no rows → render `<BetweenToursCard />`:
     - Eyebrow: "BETWEEN TOURS".
     - Heading: "No shows currently scheduled."
     - Body: "We're off the road right now. Follow us on Instagram for tour
       news as soon as new dates are announced."
     - Two links: "Past shows →" (to `/tour#past` if you want, or `/tour`),
       and "Instagram" (to the configured Instagram URL).
     - No "Book us" CTA here — the hero already has it.
   - Both cards live in the same hero slot, same width (~380px), same visual
     weight, so layout doesn't shift.

4. **Heading hierarchy cleanup**
   - One `<h1>` per page. On the homepage, the `<h1>` is the band name
     (visually hidden as today, since the logo image carries the wordmark
     visually). All section labels become `<h2>` (eyebrow + heading).
   - Same rule on every page.

5. **Responsive — mobile (< 900px)**
   - Hero stacks: logo + tagline + CTAs on top, Next Show card directly below
     at full width. Background photo still full-bleed but with a stronger
     overlay (multiply `overlay_opacity` by ~1.3 on mobile).
   - CTA buttons stack and go full-width.
   - Nav becomes a hamburger below ~720px. Wordmark logo stays on the left.
   - Social strip: same layout, just less vertical padding (~80px instead of 140px).
   - Footer: stays one line, centered.

### Admin panel — new "Forsiden" tab

Add between "Om bandet" and "Bandmedlemmer" in the admin tab strip.

All fields are editable text/upload/sliders. Either extend the existing
`settings` table with these columns, or create a new `frontpage` table with
a single row (whichever fits the existing pattern better — the codebase
already uses single-row `settings` for similar things, so extending it is
probably simpler).

| Field | Type | Default |
|---|---|---|
| `hero_eyebrow` | text | "Pink Floyd Tribute · Est. 2017" |
| `hero_tagline` | text | "A powerful tribute to one of the greatest bands in music history." |
| `hero_background_image` | image upload, **nullable** | empty |
| `hero_overlay_opacity` | number 0–1 slider | 0.65 |
| `hero_cta_primary_label` | text | "All concerts →" |
| `hero_cta_primary_href` | text | "/tour" |
| `hero_cta_secondary_label` | text | "Book us" |
| `hero_cta_secondary_href` | text | "mailto:shineonyouband@gmail.com?subject=Booking%20inquiry" |
| `next_show_kicker` | text | "Next Show" |
| `between_tours_eyebrow` | text | "BETWEEN TOURS" |
| `between_tours_heading` | text | "No shows currently scheduled." |
| `between_tours_body` | textarea | (default copy above) |
| `social_kicker` | text | "FOLLOW US" |

**Behavior:** if `hero_background_image` is empty, render the hero on solid
black (no gradient/overlay layers). If it's set, render the image and apply
the overlay scaled by `hero_overlay_opacity`.

### Acceptance criteria
- New homepage renders correctly on desktop, tablet, and mobile.
- Admin can toggle background image, adjust overlay, and edit every piece of
  copy on the page.
- Empty state (no upcoming concerts) is visually balanced — same card width
  as the populated state.
- All other pages (Tour, About, Gallery, Videos) still work, just with the
  new nav logo.
- Lighthouse and Rich Results checks from phase 1 still pass.

---

## Phase 3 — Book Us page (PR #3)

Goal: a real EPK (Electronic Press Kit) page for promoters and venues.
Replaces the current mailto-only flow.

### Tasks

1. **New route `/book`**
   - Add to `App.jsx`. Nav gets a new "BOOK" item between "Videos" and the end
     (already a placeholder in the design canvas).

2. **Page structure**
   - Hero strip: short pitch ("Bring Shine On You to your venue"), one
     paragraph, primary CTA "Send inquiry" (anchor to the form below).
   - **Tech rider** download — PDF link. Upload field in admin.
   - **Stage plot** download — PDF or image. Upload field in admin.
   - **Press photos** — grid of 4–6 high-res photos with download buttons.
     Reuse the existing `gallery_images` table with a `is_press_photo` flag,
     or a new `press_photos` table.
   - **Booking form**:
     - Fields: name, email, organisation, proposed date(s), venue, city,
       capacity, message.
     - Honeypot field for spam.
     - Submit via a Supabase Edge Function that emails the band
       (`shineonyouband@gmail.com`). Don't store the submission in DB unless
       the band wants a record.
     - Success state: "Thanks — we'll get back to you." No reveal of the
       email address.

3. **JSON-LD `ContactPage`** on `/book`.

4. **Admin panel — new "Bokning" tab**
   - Upload rider PDF.
   - Upload stage plot PDF/image.
   - Manage press photos (list, upload, delete, reorder).
   - Optionally: an inbox view of received bookings if the band wants
     submissions stored.

5. **Update hero CTA on homepage**
   - "Book us" secondary CTA stops being `mailto:` and starts pointing to
     `/book`.
   - The Between Tours card already doesn't push booking — no change there.

### Acceptance criteria
- Form sends an email reliably; spam protection works.
- Rider + stageplot + press photos are downloadable.
- No plain-text email address anywhere on the page.

---

## Suggested branching

```
main
├── feat/seo-quickwins        ← PR #1 (phase 1)
├── feat/new-homepage         ← PR #2 (phase 2)
└── feat/book-us-page         ← PR #3 (phase 3)
```

Phases 1 and 2 are fully independent. Phase 3 should come after phase 2
(it removes the temporary `mailto:` hero CTA introduced in phase 2).

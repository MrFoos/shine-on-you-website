# Brand switch — promo (old logo) → autumn (new logo)

The site currently runs the **old identity** for the hero logo and the social
share image, to match active social promo. Two pieces have already moved to the
new identity as a soft preview: the **nav wordmark**, and the **favicon** (since
11 September 2026). Leave both as they are.

## To go live with the new identity (3 October 2026)

Change **one file**:

### 1. `src/config/branding.js`
Comment the `LEGACY` lines, uncomment the `new` lines for both exports:

```js
// export const HERO_LOGO = '/images/logo-legacy.png'  // ← comment this out
export const HERO_LOGO = '/images/logo-full.png'        // ← uncomment this

// export const OG_IMAGE = '/images/og-image-legacy.png'  // ← comment this out
export const OG_IMAGE = '/images/og-image.png'            // ← uncomment this
```

### 2. `index.html` — already done
The favicon block was swapped on 11 September 2026. Nothing left to do here.

Then **commit + deploy**. No admin or database changes needed.

## At the same time

Update the logo across social profiles (Facebook, Instagram, YouTube) to match.

## Assets in `public/images/`

| File | Used for |
|---|---|
| `logo-legacy.png` | Hero logo — promo period |
| `logo-full.png` | Hero logo — new identity |
| `logo-wordmark.png` | Nav — always new (soft preview) |
| `favicon-legacy.ico` | Favicon — promo period, no longer referenced |
| `favicon-new-512.png` | Favicon — new identity, live since 11 Sep 2026 |
| `og-image-legacy.png` | Social share image — promo period |
| `og-image.png` | Social share image — new identity |

## Press page (`/press`)

`/press` is an unlisted page — it is publicly reachable, but has no nav link and
is not in `sitemap.xml`. The URL is shared directly with whoever needs the files.

### How it is kept out of search

The site is a SPA where every route is served from one `index.html`, so a
`robots` meta tag rendered by react-helmet only exists after JavaScript has run.
Two things cover the crawlers that do not run JS:

1. `scripts/generate-press-html.js` writes `dist/press/index.html` after the
   Vite build — same page, but with `noindex, nofollow` in the static markup and
   without the homepage fallback that `generate-static.js` injects. nginx tries
   `$uri/` before the SPA fallback (`/images/` answers 403, not the homepage),
   so `/press` redirects to `/press/` and is served from this file. Verified in
   production on 11 September 2026:

   ```sh
   curl -sL https://shineonyou.no/press | grep -c 'name="robots"'   # 1
   ```

   Note the `-L`: without it curl stops at the 301 and reports 0, which says
   nothing about the page behind the redirect.
2. An `X-Robots-Tag` header from nginx — the only thing that also covers the
   files under `/press/logo/`, since a meta tag cannot protect a PNG or a PDF.
   **In place since 11 September 2026**, as
   `/etc/nginx/snippets/press-noindex.conf` on the web server, included from the
   `shineonyou.no` server block in `sites-available/shineonyou`:

   ```nginx
   location ^~ /press {
       add_header X-Robots-Tag "noindex, nofollow, noarchive" always;
       try_files $uri $uri/ /index.html;
   }
   ```

   `try_files` is repeated because this block overrides `location /` for these
   paths. The server config is not in this repo, so the snippet has to be
   removed by hand at launch — see below.

There is deliberately **no** `Disallow: /press` in `robots.txt`. It would stop
crawlers from ever reading the `noindex`, and a public robots.txt advertising
the path is worse than saying nothing at all.

Be clear about what this is: the page is on a public origin behind a guessable
path. It keeps `/press` out of search results; it does not stop anyone who has
the URL from passing it on. If a leak before launch would genuinely be a
problem, move the route to something unguessable (`/press-a7f3c9`) — that is a
one-line change in `App.jsx`.

### Two sources, on purpose

The page has two kinds of downloads, and they are managed in different places:

| | Logos | Documents |
|---|---|---|
| Lives in | `public/press/logo/` in this repo | Supabase (`presskit_files` + `presskit` bucket) |
| Managed by | a developer, at build time | the band, in admin → Press Kit |
| Why | needs derived sizes, previews and a ZIP; must not be deletable by accident; changes once per identity | handed to the visitor as uploaded; changes whenever a rider does |

The Documents section is hidden entirely until the band uploads something, so
the page reads as finished while the table is empty.

One caveat worth remembering before launch: files uploaded in admin are served
from Supabase's own origin, not from shineonyou.no. They are **not** covered by
the `noindex` above or by any `X-Robots-Tag` we add to nginx. Do not upload
anything showing the new identity until it is public.

### The logo files

Downloads are static files in `public/press/logo/`:

| File | Contents |
|---|---|
| `shine-on-you-logo.png` | Primary logo (with prism), black background, 5367 × 2853 |
| `shine-on-you-logo-small.png` | Primary logo, black background, 1200 × 638 |
| `shine-on-you-logo-transparent.png` | Primary logo, transparent, 3579 × 1902 |
| `shine-on-you-logo-transparent-small.png` | Primary logo, transparent, 1200 × 638 |
| `shine-on-you-logo.pdf` | Primary logo, vector for print |
| `shine-on-you-wordmark.png` | Wordmark, black background, 3854 × 2445 |
| `shine-on-you-wordmark-small.png` | Wordmark, black background, 1200 × 761 |
| `shine-on-you-wordmark-transparent.png` | Wordmark, transparent, 2601 × 1409 |
| `shine-on-you-wordmark-transparent-small.png` | Wordmark, transparent, 1200 × 650 |
| `shine-on-you-wordmark.pdf` | Wordmark, vector for print |
| `preview-logo.png`, `preview-wordmark.png` | On-page display only |

`shine-on-you-logos.zip` is **not** in git. `scripts/build-press-zip.js` packs
every `shine-on-you-*.png|pdf` in that folder at build time, so the archive
cannot fall behind the files it contains.

**When the logo changes:** replace the files, regenerate the two 1200 px small
variants and the two previews (previews are cropped to the artwork, transparent,
1000 px wide), and update the pixel dimensions in `src/pages/PressPage.jsx`. The
ZIP takes care of itself. `PressPage.test.jsx` fails if a stated dimension does
not match the PNG on disk, if a linked file is missing, or if the ZIP would not
contain exactly the files the page links to.

**At launch:** add "Press" to the nav if the page should be public, drop the
`noindex` in `PressPage.jsx` and in `generate-press-html.js`, add the URL to
`sitemap.xml`, and remove the nginx snippet on the server:

```sh
# On the web server — this repo does not hold the host or the credentials.
rm /etc/nginx/snippets/press-noindex.conf
sed -i '/press-noindex/d' /etc/nginx/sites-available/shineonyou
nginx -t && systemctl reload nginx
```

If the page should stay unlisted, leave all of it as is.

Note: the whole identity is drawn for a **black background** — the transparent
PNGs have white lettering and disappear on light backgrounds. There is no dark
variant of the wordmark for use on light surfaces.

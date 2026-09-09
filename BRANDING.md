# Brand switch — promo (old logo) → autumn (new logo)

The site currently runs the **old identity** to match active social promo.
The **new identity** (logo, favicon, OG image) is already in the repo, ready.
The nav already shows the new wordmark as a soft preview — leave it as-is.

## To go live with the new identity (autumn launch)

Change **two files**:

### 1. `src/config/branding.js`
Comment the `LEGACY` lines, uncomment the `new` lines for both exports:

```js
// export const HERO_LOGO = '/images/logo-legacy.png'  // ← comment this out
export const HERO_LOGO = '/images/logo-full.png'        // ← uncomment this

// export const OG_IMAGE = '/images/og-image-legacy.png'  // ← comment this out
export const OG_IMAGE = '/images/og-image.png'            // ← uncomment this
```

### 2. `index.html`
Swap the favicon block — comment out the legacy block, uncomment the new block:

```html
<!-- legacy block: comment this out -->
<!-- <link rel="icon" type="image/x-icon" href="/images/favicon-legacy.ico" /> -->
<!-- <link rel="icon" type="image/png" sizes="32x32" href="/images/logo-legacy.png" /> -->
<!-- <link rel="apple-touch-icon" sizes="180x180" href="/images/logo-legacy.png" /> -->

<!-- new block: uncomment this -->
<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-new-512.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/images/favicon-new-512.png" />
```

Then **commit + deploy**. No admin or database changes needed.

## At the same time

Update the logo across social profiles (Facebook, Instagram, YouTube) to match.

## Assets in `public/images/`

| File | Used for |
|---|---|
| `logo-legacy.png` | Hero logo — promo period |
| `logo-full.png` | Hero logo — new identity |
| `logo-wordmark.png` | Nav — always new (soft preview) |
| `favicon-legacy.ico` | Favicon — promo period |
| `favicon-new-512.png` | Favicon — new identity |
| `og-image-legacy.png` | Social share image — promo period |
| `og-image.png` | Social share image — new identity |

## Press page (`/press`)

`/press` is an unlisted page — it is publicly reachable, but has no nav link, is
not in `sitemap.xml`, and is `Disallow`-ed in `robots.txt` plus `noindex` in the
markup until the new identity launches. The URL is shared directly with whoever
needs the files.

The downloads are static files in `public/press/logo/`:

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
| `shine-on-you-logo.zip` | All ten files bundled |
| `preview-logo.png`, `preview-wordmark.png` | On-page display only |

**When the logo changes:** replace the files, regenerate the ZIP
(`cd public/press/logo && zip -j shine-on-you-logo.zip shine-on-you-*.png shine-on-you-*.pdf`),
regenerate the 1200 px small variants, and update the pixel dimensions and the
ZIP size in `src/pages/PressPage.jsx`.

**At launch:** add "Press" to the nav if the page should be public, drop the
`noindex` in `PressPage.jsx` and `Disallow: /press` in `robots.txt`, and add the
URL to `sitemap.xml`. If the page should stay unlisted, leave all of it as is.

Note: the whole identity is drawn for a **black background** — the transparent
PNGs have white lettering and disappear on light backgrounds. There is no dark
variant of the wordmark for use on light surfaces.

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

## Press-side (`/press`)

`/press` er en upublisert side — den ligger åpent, men har ingen nav-lenke, står
ikke i `sitemap.xml` og er `Disallow`-et i `robots.txt` + `noindex` inntil den
nye identiteten er lansert. URL-en deles direkte med de som skal ha filene.

Nedlastingsfilene ligger som statiske filer i `public/press/logo/`:

| Fil | Innhold |
|---|---|
| `shine-on-you-logo.png` | Hovedlogo (med dekor), svart bakgrunn, 5367 × 2853 |
| `shine-on-you-logo-transparent.png` | Hovedlogo, transparent, 3579 × 1902 |
| `shine-on-you-logo.pdf` | Hovedlogo, vektor til trykk |
| `shine-on-you-wordmark.png` | Navnetrekk, svart bakgrunn, 3854 × 2445 |
| `shine-on-you-wordmark-transparent.png` | Navnetrekk, transparent, 2601 × 1409 |
| `shine-on-you-wordmark.pdf` | Navnetrekk, vektor til trykk |
| `shine-on-you-logo.zip` | Alle seks filene samlet |
| `preview-logo.png`, `preview-wordmark.png` | Kun visning på siden |

**Ved endring av logo:** bytt filene, generer ZIP-en på nytt
(`cd public/press/logo && zip -j shine-on-you-logo.zip shine-on-you-*.png shine-on-you-*.pdf`),
og oppdater pikselmålene i `src/pages/PressPage.jsx`.

**Ved lansering:** legg «Press» inn i nav om den skal være offentlig, fjern
`noindex` i `PressPage.jsx` og `Disallow: /press` i `robots.txt`, og legg URL-en
i `sitemap.xml`. Skal siden fortsatt være uoppført, la alt stå som det er.

Merk: hele identiteten er tegnet for **svart bakgrunn** — de transparente PNG-ene
har hvit tekst og blir usynlige på lys bakgrunn. Det finnes ingen mørk variant av
navnetrekket til bruk på lyse flater.

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

import { Helmet } from 'react-helmet-async'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import styles from './PressPage.module.css'

const BASE = '/press/logo'

export const ZIP_FILE = `${BASE}/shine-on-you-logos.zip`

export const LOGOS = [
  {
    id: 'logo',
    name: 'Primary logo',
    note: 'Wordmark with prism and light beam. Use this by default.',
    preview: `${BASE}/preview-logo.png`,
    // Prismet stikker over og under bokstavene, så motivet må vises høyere enn
    // navnetrekket for at «shine on you» skal bli like stor i de to kortene.
    tallPreview: true,
    files: [
      { label: 'PNG — black background, small', meta: '1200 × 638', file: `${BASE}/shine-on-you-logo-small.png` },
      { label: 'PNG — black background, large', meta: '5367 × 2853', file: `${BASE}/shine-on-you-logo.png` },
      { label: 'PNG — transparent, small', meta: '1200 × 638', file: `${BASE}/shine-on-you-logo-transparent-small.png` },
      { label: 'PNG — transparent, large', meta: '3579 × 1902', file: `${BASE}/shine-on-you-logo-transparent.png` },
      { label: 'PDF — vector, for print', meta: 'Scalable', file: `${BASE}/shine-on-you-logo.pdf` },
    ],
  },
  {
    id: 'wordmark',
    name: 'Wordmark',
    note: 'The name on its own, without the prism. Use this on small surfaces and tight spaces.',
    preview: `${BASE}/preview-wordmark.png`,
    files: [
      { label: 'PNG — black background, small', meta: '1200 × 761', file: `${BASE}/shine-on-you-wordmark-small.png` },
      { label: 'PNG — black background, large', meta: '3854 × 2445', file: `${BASE}/shine-on-you-wordmark.png` },
      { label: 'PNG — transparent, small', meta: '1200 × 650', file: `${BASE}/shine-on-you-wordmark-transparent-small.png` },
      { label: 'PNG — transparent, large', meta: '2601 × 1409', file: `${BASE}/shine-on-you-wordmark-transparent.png` },
      { label: 'PDF — vector, for print', meta: 'Scalable', file: `${BASE}/shine-on-you-wordmark.pdf` },
    ],
  },
]

const GUIDELINES = [
  'The logo is made for dark backgrounds. On a light background, use the PNG with the black background, or place the logo on a black surface.',
  'Do not stretch, rotate, crop or recolour the logo.',
  'Keep clear space around the logo — at least the height of the "s" in "shine" on every side.',
  'For print, use the PDFs. They are vector files and scale to any size without loss of quality.',
]

export default function PressPage() {
  return (
    <div className="container">
      <SEO
        title="Press"
        description="Logos and promotional material from Shine On You."
        canonicalPath="/press"
      />
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Nav />
      <main id="main-content">
        <section className={styles.pressPage}>
          <h1>Press</h1>
          <p className={styles.intro}>
            Logos and promotional material, free to use in coverage, posters and
            programmes. Small is sized for web and screen, large for print and big
            surfaces.
          </p>

          <div className={styles.sectionHead}>
            <h2>Logo</h2>
            <a className={styles.zipBtn} href={ZIP_FILE} download>
              Download all logos (ZIP)
            </a>
          </div>

          <div className={styles.logoGrid}>
            {LOGOS.map((logo) => (
              <article key={logo.id} className={styles.logoCard}>
                <div
                  className={[styles.preview, logo.tallPreview ? styles.previewTall : '']
                    .filter(Boolean)
                    .join(' ')}
                >
                  <img src={logo.preview} alt={`Shine On You – ${logo.name}`} />
                </div>
                <h3>{logo.name}</h3>
                <p className={styles.note}>{logo.note}</p>
                <ul className={styles.fileList}>
                  {logo.files.map(({ label, meta, file }) => (
                    <li key={file}>
                      <a
                        href={file}
                        download
                        className={styles.fileBtn}
                        aria-label={`${logo.name} — ${label}, ${meta}`}
                      >
                        <span className={styles.fileLabel}>{label}</span>
                        <span className={styles.fileMeta}>{meta}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className={styles.guidelines}>
            <h2>Using the logo</h2>
            <ul>
              {GUIDELINES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

import { Helmet } from 'react-helmet-async'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import styles from './PressPage.module.css'

const BASE = '/press/logo'

const LOGOS = [
  {
    id: 'logo',
    name: 'Hovedlogo',
    note: 'Navnetrekk med prisme og lysstråle. Bruk denne der det er plass til hele merket.',
    preview: `${BASE}/preview-logo.png`,
    files: [
      { label: 'PNG — svart bakgrunn', meta: '5367 × 2853', file: `${BASE}/shine-on-you-logo.png` },
      { label: 'PNG — transparent', meta: '3579 × 1902', file: `${BASE}/shine-on-you-logo-transparent.png` },
      { label: 'PDF — vektor, trykk', meta: 'Skalerbar', file: `${BASE}/shine-on-you-logo.pdf` },
    ],
  },
  {
    id: 'wordmark',
    name: 'Navnetrekk',
    note: 'Kun navnet, uten dekor. Bruk denne på små flater og der prismet ikke får plass.',
    preview: `${BASE}/preview-wordmark.png`,
    files: [
      { label: 'PNG — svart bakgrunn', meta: '3854 × 2445', file: `${BASE}/shine-on-you-wordmark.png` },
      { label: 'PNG — transparent', meta: '2601 × 1409', file: `${BASE}/shine-on-you-wordmark-transparent.png` },
      { label: 'PDF — vektor, trykk', meta: 'Skalerbar', file: `${BASE}/shine-on-you-wordmark.pdf` },
    ],
  },
]

const GUIDELINES = [
  'Logoen er laget for mørk bakgrunn. På lys bakgrunn: bruk PNG-en med svart bakgrunn, eller sett logoen på en svart flate.',
  'Ikke strekk, roter, beskjær eller endre fargene i logoen.',
  'Hold luft rundt logoen — minst høyden på «s» i «shine» på alle sider.',
  'Til trykk: bruk PDF-ene. De er vektor og kan skaleres fritt uten kvalitetstap.',
]

export default function PressPage() {
  return (
    <div className="container">
      <SEO
        title="Press"
        description="Logoer og promomateriell fra Shine On You."
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
            Logoer og promomateriell til fri bruk i omtale, plakater og program.
            Spørsmål eller behov for noe som ikke ligger her — ta kontakt med bandet.
          </p>

          <div className={styles.sectionHead}>
            <h2>Logo</h2>
            <a className={styles.zipBtn} href={`${BASE}/shine-on-you-logo.zip`} download>
              Last ned alle logoer (ZIP, 2,4 MB)
            </a>
          </div>

          <div className={styles.logoGrid}>
            {LOGOS.map((logo) => (
              <article key={logo.id} className={styles.logoCard}>
                <div className={styles.preview}>
                  <img src={logo.preview} alt={`Shine On You – ${logo.name}`} loading="lazy" />
                </div>
                <h3>{logo.name}</h3>
                <p className={styles.note}>{logo.note}</p>
                <ul className={styles.fileList}>
                  {logo.files.map(({ label, meta, file }) => (
                    <li key={file}>
                      <a href={file} download className={styles.fileBtn}>
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
            <h2>Slik bruker du logoen</h2>
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

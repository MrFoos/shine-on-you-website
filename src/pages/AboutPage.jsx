import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'
import styles from './AboutPage.module.css'

export default function AboutPage() {
  const [paragraphs, setParagraphs] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('about').select('bio').eq('id', 1).single(),
      supabase.from('members').select('*').order('sort_order'),
    ]).then(([{ data: aboutData }, { data: membersData }]) => {
      if (aboutData?.bio) {
        setParagraphs(aboutData.bio.split('\n').map(p => p.trim()).filter(Boolean))
      }
      setMembers(membersData ?? [])
      setLoading(false)
    })
  }, [])

  const getMemberUrl = (path) =>
    supabase.storage.from('members').getPublicUrl(path).data.publicUrl

  const personSchemas = members.map((m) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: m.name,
    image: getMemberUrl(m.storage_path),
    memberOf: {
      '@type': 'MusicGroup',
      name: 'Shine On You',
      url: 'https://shineonyou.no',
    },
  }))

  return (
    <div className="container">
      <SEO
        title="About the Band – Shine On You Pink Floyd Tribute"
        description="Meet the musicians behind Shine On You, Scandinavia's leading Pink Floyd tribute band."
        canonicalPath="/about"
      />
      {personSchemas.length > 0 && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(personSchemas)}</script>
        </Helmet>
      )}
      <Nav />
      <main id="main-content">
      <section className={styles.aboutPage}>
        <h1>About</h1>
        <div className={styles.aboutBio}>
          {loading
            ? <div role="status" aria-label="Loading content"><div className="events-spinner" /></div>
            : paragraphs.map((para, i) => (
                <p key={i} className={i === 0 ? styles.aboutTagline : undefined}>{para}</p>
              ))
          }
        </div>

        <div className={styles.membersGrid}>
          {members.map(m => (
            <div className={styles.memberCard} key={m.id}>
              <img src={getMemberUrl(m.storage_path)} alt={m.name} />
              <p className={styles.memberName}>{m.name}</p>
              <p className={styles.memberRole}>{m.role}</p>
            </div>
          ))}
        </div>

        <p className={styles.membersPhotoCredit}>Photo: Espen Håkonsen</p>
      </section>
      </main>
      <Footer />
    </div>
  )
}

import { useEffect, useState } from 'react'
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

  return (
    <div className="container">
      <SEO
        title="About the Band – Shine On You Pink Floyd Tribute"
        description="Learn more about Shine On You, the Pink Floyd tribute band from Norway. 10 musicians dedicated to recreating Pink Floyd's unique soundscapes."
        canonicalPath="/about"
      />
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

import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

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
        title="Om bandet – Shine On You Pink Floyd Tribute"
        description="Lær mer om Shine On You, Pink Floyd tributebandet fra Norge. 10 musikere dedikert til å gjenskape Pink Floyds unike lydlandskap."
        canonicalPath="/about"
      />
      <Nav />
      <section className="about-page">
        <h2>About</h2>
        <div className="about-bio">
          {loading
            ? <div className="events-spinner" />
            : paragraphs.map((para, i) => (
                <p key={i} className={i === 0 ? 'about-tagline' : undefined}>{para}</p>
              ))
          }
        </div>

        <div className="members-grid">
          {members.map(m => (
            <div className="member-card" key={m.id}>
              <img src={getMemberUrl(m.storage_path)} alt={m.name} />
              <p className="member-name">{m.name}</p>
              <p className="member-role">{m.role}</p>
            </div>
          ))}
        </div>

        <p className="members-photo-credit">Photo: Espen Håkonsen</p>
      </section>
      <Footer />
    </div>
  )
}

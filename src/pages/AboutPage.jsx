import { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'

const MEMBERS = [
  { name: 'Pelle Anderson',          role: 'Guitar and vocals',           img: '/images/members/member-pelle-anderson.jpg' },
  { name: 'Anders Hagen Høigaard',   role: 'Guitar and vocals',           img: '/images/members/member-anders-hagen-hoigaard.jpg' },
  { name: 'Svein Bekkevold',         role: 'Guitar and vocals',           img: '/images/members/member-svein-bekkevold.jpg' },
  { name: 'Geir Atle Wiig Johansen', role: 'Guitar and backing vocals',   img: '/images/members/member-geir-atle-wiig-johansen.jpg' },
  { name: 'Andreas Hveding',         role: 'Bass and backing vocals',     img: '/images/members/member-andreas-hveding.jpg' },
  { name: 'Jan Barry Brandth',       role: 'Drums',                       img: '/images/members/member-jan-barry-brandth.jpg' },
  { name: 'Svein Erik Haug',         role: 'Saxophone and keyboards',     img: '/images/members/member-svein-erik-haug.jpg' },
  { name: 'Ole Kåre Tangen',         role: 'Keyboards',                   img: '/images/members/member-ole-kare-tangen.jpg' },
  { name: 'Elisabeth Erlien Ruud',   role: 'Backing vocals',              img: '/images/members/member-elisabeth-erlien-ruud.jpg' },
  { name: 'Randi Andreassen',        role: 'Backing vocals',              img: '/images/members/member-randi-andreassen.jpg' },
]

export default function AboutPage() {
  const [paragraphs, setParagraphs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('about').select('bio').eq('id', 1).single()
      .then(({ data }) => {
        if (data?.bio) {
          setParagraphs(data.bio.split('\n').map(p => p.trim()).filter(Boolean))
        }
        setLoading(false)
      })
  }, [])

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
          {MEMBERS.map(m => (
            <div className="member-card" key={m.name}>
              <img src={m.img} alt={m.name} />
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

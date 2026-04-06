import Footer from '../components/Footer'

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

const BIO = [
  `A powerful tribute to one of the greatest bands in music history`,
  `Since its formation in 2017, Shine On You – featuring members from Oslo, Hamar, and Kungsbacka – has performed to sold-out audiences across Norway and Sweden. Over the years, the band has refined both its musical and visual expression, with a strong focus on capturing the depth and detail of Pink Floyd's iconic sound and stage productions.`,
  `Shine On You's ambition is to recreate the essence of Pink Floyd as authentically as possible, bringing to life the legendary band's extensive catalogue with precision, passion, and respect.`,
  `With a keen ear for detail and a deep appreciation for the artistry behind Pink Floyd's concept albums and live performances, the band delivers immersive concerts featuring spectacular light shows and carefully curated video content at theatres and concert venues.`,
  `Among the many highlights, Shine On You has performed the Atom Heart Mother Suite in the cathedral ruins of Hamar, accompanied by brass ensemble, soloists, and choir. The band has also returned to packed venues with performances of large parts of The Dark Side of the Moon, Wish You Were Here, and The Wall.`,
]

export default function AboutPage() {
  return (
    <div className="container">
      <section className="about-page">
        <h2>About</h2>
        <div className="about-bio">
          {BIO.map((para, i) => (
            <p key={i} className={i === 0 ? 'about-tagline' : undefined}>{para}</p>
          ))}
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

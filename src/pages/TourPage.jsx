import Nav from '../components/Nav'
import Events from '../components/Events'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function TourPage() {
  return (
    <div className="container">
      <SEO
        title="Konserter & turné – Shine On You"
        description="Se kommende konserter med Shine On You. Vi spiller over hele Norge og Sverige – sjekk turné-datoer og kjøp billetter."
        canonicalPath="/tour"
      />
      <Nav />
      <main id="main-content">
        <Events />
      </main>
      <Footer />
    </div>
  )
}

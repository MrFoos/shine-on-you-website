import Nav from '../components/Nav'
import Events from '../components/Events'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function TourPage() {
  return (
    <div className="container">
      <SEO
        title="Concerts & Tour – Shine On You"
        description="See upcoming concerts with Shine On You. We perform all across Norway and Sweden – check tour dates and buy tickets."
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

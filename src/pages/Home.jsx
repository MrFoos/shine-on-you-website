import Nav from '../components/Nav'
import Header from '../components/Header'
import Events from '../components/Events'
import SocialMedia from '../components/SocialMedia'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Nav />
      <Header />
      <Events />
      <SocialMedia />
      <Footer />
    </div>
  )
}

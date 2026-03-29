import Header from '../components/Header'
import ImageSlider from '../components/ImageSlider'
import Events from '../components/Events'
import SocialMedia from '../components/SocialMedia'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="container">
      <Header />
      <ImageSlider />
      <Events />
      <SocialMedia />
      <Footer />
    </div>
  )
}

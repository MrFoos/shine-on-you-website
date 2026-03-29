import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'

export default function SocialMedia() {
  return (
    <section id="social-media" className="social-media">
      <div className="social-icons">
        <a
          href="https://www.facebook.com/ShineOnU21"
          className="facebook"
          aria-label="Visit our Facebook page"
        >
          <FaFacebookF size={32} />
        </a>
        <a
          href="https://www.instagram.com/shineonyou_official/"
          className="instagram"
          aria-label="Visit our Instagram page"
        >
          <FaInstagram size={32} />
        </a>
        <a
          href="https://www.youtube.com/@shineonyou-gq7uc"
          className="youtube"
          aria-label="Visit our Youtube page"
        >
          <FaYoutube size={32} />
        </a>
      </div>
    </section>
  )
}

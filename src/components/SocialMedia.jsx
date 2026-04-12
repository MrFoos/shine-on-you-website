import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa'
import styles from './SocialMedia.module.css'

export default function SocialMedia() {
  return (
    <section id="social-media" className={styles.socialMedia}>
      <div className={styles.socialIcons}>
        <a
          href="https://www.facebook.com/ShineOnU21"
          className={styles.facebook}
          aria-label="Visit our Facebook page"
        >
          <FaFacebookF size={32} />
        </a>
        <a
          href="https://www.instagram.com/shineonyou_official/"
          className={styles.instagram}
          aria-label="Visit our Instagram page"
        >
          <FaInstagram size={32} />
        </a>
        <a
          href="https://www.youtube.com/@shineonyou-gq7uc"
          className={styles.youtube}
          aria-label="Visit our Youtube page"
        >
          <FaYoutube size={32} />
        </a>
      </div>
    </section>
  )
}

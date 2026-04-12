import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer>
      <a className={styles.footerContactBtn} href="mailto:shineonyouband@gmail.com">
        Contact us
      </a>
      <p>&copy; 2026 Shine On You DA. Org.nr: 922 087 857.<br />All rights reserved.</p>
    </footer>
  )
}

import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>© {year} Shine On You DA · Org.nr 922 087 857</p>
    </footer>
  )
}

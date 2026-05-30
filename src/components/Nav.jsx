import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <a href="#main-content" className={styles.skipLink}>Skip to content</a>
      <nav className={styles.mainNav}>
        <Link to="/" className={styles.logoLink}>
          <img src="/images/logo-wordmark.png" alt="Shine On You" className={styles.logoImg} />
        </Link>
        <button
          className={styles.hamburger}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
        <ul className={[styles.navLinks, menuOpen ? styles.navLinksOpen : ''].filter(Boolean).join(' ')}>
          <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/tour" onClick={() => setMenuOpen(false)}>Tour</NavLink></li>
          <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink></li>
          <li><NavLink to="/gallery" onClick={() => setMenuOpen(false)}>Gallery</NavLink></li>
          <li><NavLink to="/videos" onClick={() => setMenuOpen(false)}>Videos</NavLink></li>
        </ul>
      </nav>
    </>
  )
}

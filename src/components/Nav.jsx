import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <>
      <a href="#main-content" className={styles.skipLink}>Hopp til innhold</a>
      <nav className={styles.mainNav}>
        <ul className={styles.navLinks}>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/tour">Tour</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/gallery">Gallery</NavLink></li>
        </ul>
      </nav>
    </>
  )
}

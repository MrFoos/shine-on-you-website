import { NavLink } from 'react-router-dom'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.mainNav}>
      <ul className={styles.navLinks}>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/tour">Tour</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/gallery">Gallery</NavLink></li>
      </ul>
    </nav>
  )
}

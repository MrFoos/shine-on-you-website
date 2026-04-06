import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="main-nav">
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/gallery">Gallery</NavLink></li>
      </ul>
    </nav>
  )
}

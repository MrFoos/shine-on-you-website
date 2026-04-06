import { Link } from 'react-router-dom'

export default function CompactHeader() {
  return (
    <header className="header-compact">
      <Link to="/">
        <img src="/images/Banner Web.png" alt="Shine On You – back to home" />
      </Link>
    </header>
  )
}

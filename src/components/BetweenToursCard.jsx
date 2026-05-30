import { Link } from 'react-router-dom'
import styles from './BetweenToursCard.module.css'

export default function BetweenToursCard({ eyebrow, heading, body, instagramUrl }) {
  return (
    <div className={styles.card}>
      <p className={styles.eyebrow}>{eyebrow || 'BETWEEN TOURS'}</p>
      <h2 className={styles.heading}>
        {heading || 'No shows currently scheduled.'}
      </h2>
      <p className={styles.body}>
        {body || "We're off the road right now. Follow us on Instagram for tour news as soon as new dates are announced."}
      </p>
      <div className={styles.links}>
        <Link to="/tour" className={styles.link}>Past shows →</Link>
        {instagramUrl && (
          <a href={instagramUrl} className={styles.link} target="_blank" rel="noopener noreferrer">
            Instagram →
          </a>
        )}
      </div>
    </div>
  )
}

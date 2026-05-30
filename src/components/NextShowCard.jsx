import styles from './NextShowCard.module.css'

export default function NextShowCard({ event, kicker }) {
  const date = new Date(event.date + 'T00:00:00')
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('nb-NO', { month: 'short' }).toUpperCase().replace('.', '')
  const year = date.getFullYear()

  return (
    <div className={styles.card}>
      <p className={styles.kicker}>{kicker || 'Next Show'}</p>
      <div className={styles.dateBlock}>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
        <span className={styles.year}>{year}</span>
      </div>
      <p className={styles.location}>{event.city}, {event.country}</p>
      <p className={styles.venue}>{event.venue}</p>
      {event.ticket_url && (
        <a
          href={event.ticket_url}
          className={styles.ticketsLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          Tickets →
        </a>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import styles from './Events.module.css'

function TicketLabel({ event }) {
  if (event.ticket_status === 'available') {
    return <a href={event.ticket_url}>TICKETS</a>
  }
  if (event.ticket_status === 'coming_soon') {
    return <div>TICKETS – Coming Soon</div>
  }
  return <div>SOLD OUT!</div>
}

function EventCard({ event, past }) {
  const d = new Date(event.date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = d.toLocaleString('nb-NO', { month: 'short' }).toUpperCase().replace('.', '')
  const year = d.getFullYear()

  return (
    <div className={`${styles.event}${past ? ` ${styles.eventPast}` : ''}`}>
      <div className={styles.eventDateBlock}>
        <span className={styles.eventDay}>{day}</span>
        <span className={styles.eventMonth}>{month}</span>
        <span className={styles.eventYear}>{year}</span>
      </div>
      <div className={styles.eventDetails}>
        <div className={styles.eventDetailsTop}>
          <div className={styles.eventInfo}>
            <span className={styles.eventCity}>{event.city}, {event.country}</span>
            <span className={styles.eventVenue}>{event.venue}</span>
          </div>
          <div className={styles.tickets}>
            <TicketLabel event={event} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Events() {
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [settings, setSettings] = useState({ tour_heading: 'Tour 2026', past_shows_heading: 'Past shows 2026' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date().toISOString().split('T')[0]
      const [{ data, error }, { data: settingsData }] = await Promise.all([
        supabase.from('events').select('*').order('date', { ascending: true }),
        supabase.from('settings').select('tour_heading, past_shows_heading').eq('id', 1).single(),
      ])

      if (error) {
        setError(true)
      } else if (data) {
        setUpcoming(data.filter((e) => e.date >= today))
        setPast(data.filter((e) => e.date < today).reverse())
      }
      if (settingsData) setSettings(settingsData)
      setLoading(false)
    }

    fetchEvents()
  }, [])

  if (loading) return (
    <section id="events" className={styles.upcomingEvents}>
      <div role="status" aria-label="Laster konserter">
        <div className="events-spinner" />
      </div>
    </section>
  )
  if (error) return (
    <section id="events" className={styles.upcomingEvents}>
      <p>Could not load shows. Please try again later.</p>
    </section>
  )

  return (
    <section id="events" className={styles.upcomingEvents}>
      <div className={styles.tourHeading}>
        <h1>{settings.tour_heading}</h1>
      </div>
      {upcoming.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      {past.length > 0 && (
        <>
          <div className={styles.pastTourHeading}>
            <h2>{settings.past_shows_heading}</h2>
          </div>
          {past.map((event) => (
            <EventCard key={event.id} event={event} past />
          ))}
        </>
      )}
    </section>
  )
}

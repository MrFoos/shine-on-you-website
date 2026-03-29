import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function TicketLabel({ event }) {
  if (event.ticket_status === 'available') {
    return <a href={event.ticket_url}>TICKETS</a>
  }
  if (event.ticket_status === 'coming_soon') {
    return <div>TICKETS – Coming Soon</div>
  }
  return <div>SOLD OUT!</div>
}

function EventCard({ event }) {
  const date = new Date(event.date).toLocaleDateString('nb-NO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  return (
    <div className="event">
      <div className="event-date">{date}</div>
      <div className="event-location">{event.venue}, {event.city} {event.country}</div>
      <div className="tickets">
        <TicketLabel event={event} />
      </div>
    </div>
  )
}

export default function Events() {
  const [upcoming, setUpcoming] = useState([])
  const [past, setPast] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (!error && data) {
        setUpcoming(data.filter((e) => e.date >= today))
        setPast(data.filter((e) => e.date < today).reverse())
      }
      setLoading(false)
    }

    fetchEvents()
  }, [])

  if (loading) return null

  return (
    <section id="events" className="upcoming-events">
      <div className="tour-heading">
        <h2>Tour 2026</h2>
      </div>
      {upcoming.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      {past.length > 0 && (
        <>
          <div className="past-tour-heading">
            <h2>Past shows 2026</h2>
          </div>
          {past.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </>
      )}
    </section>
  )
}

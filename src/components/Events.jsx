const UPCOMING_EVENTS = [
  {
    id: 1,
    date: '04.09.2026',
    location: 'Vara Konserthus, Vara Sweden',
    ticketUrl: 'https://biljetter.varakonserthus.se/sv/buyingflow/tickets/28934/',
    ticketStatus: 'available',
  },
  {
    id: 2,
    date: '05.09.2026',
    location: 'Falkenbergs Stadsteater, Falkenberg Sweden',
    ticketUrl: 'https://secure.tickster.com/j1nrv6xfbhz2r4m',
    ticketStatus: 'available',
  },
  {
    id: 3,
    date: '03.10.2026',
    location: 'Västerås Konserthus, Västerås Sweden',
    ticketUrl: null,
    ticketStatus: 'coming_soon',
  },
]

const PAST_EVENTS = [
  {
    id: 4,
    date: '07.02.2026',
    location: 'Kulturhuset Ælvespeilet, Porsgrunn Norway',
    ticketStatus: 'sold_out',
  },
]

function TicketLabel({ event }) {
  if (event.ticketStatus === 'available') {
    return <a href={event.ticketUrl}>TICKETS</a>
  }
  if (event.ticketStatus === 'coming_soon') {
    return <div>TICKETS – Coming Soon</div>
  }
  return <div>SOLD OUT!</div>
}

function EventCard({ event }) {
  return (
    <div className="event">
      <div className="event-date">{event.date}</div>
      <div className="event-location">{event.location}</div>
      <div className="tickets">
        <TicketLabel event={event} />
      </div>
    </div>
  )
}

export default function Events() {
  return (
    <section id="events" className="upcoming-events">
      <div className="tour-heading">
        <h2>Tour 2026</h2>
      </div>
      {UPCOMING_EVENTS.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      <div className="past-tour-heading">
        <h2>Past shows 2026</h2>
      </div>
      {PAST_EVENTS.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </section>
  )
}

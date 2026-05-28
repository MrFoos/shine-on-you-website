import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Nav from '../components/Nav'
import Events from '../components/Events'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const TICKET_AVAILABILITY = {
  available: 'https://schema.org/InStock',
  coming_soon: 'https://schema.org/PreOrder',
  sold_out: 'https://schema.org/SoldOut',
}

function buildMusicEventSchema(event) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `Shine On You – ${event.venue}`,
    startDate: event.date,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressCountry: event.country,
      },
    },
    performer: {
      '@type': 'MusicGroup',
      name: 'Shine On You',
      url: 'https://shineonyou.no',
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  }

  if (event.ticket_url) {
    schema.offers = {
      '@type': 'Offer',
      url: event.ticket_url,
      availability: TICKET_AVAILABILITY[event.ticket_status] ?? 'https://schema.org/InStock',
    }
  }

  return schema
}

export default function TourPage() {
  const [upcomingEvents, setUpcomingEvents] = useState([])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    supabase
      .from('events')
      .select('*')
      .gte('date', today)
      .eq('is_history', false)
      .order('date', { ascending: true })
      .then(({ data }) => setUpcomingEvents(data ?? []))
  }, [])

  const schemas = upcomingEvents.map(buildMusicEventSchema)

  return (
    <div className="container">
      <SEO
        title="Concerts & Tour – Shine On You"
        description="Upcoming Shine On You concerts. Tour dates, venues and ticket links."
        canonicalPath="/tour"
      />
      {schemas.length > 0 && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(schemas)}</script>
        </Helmet>
      )}
      <Nav />
      <main id="main-content">
        <Events />
      </main>
      <Footer />
    </div>
  )
}

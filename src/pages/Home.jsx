import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Nav from '../components/Nav'
import Header from '../components/Header'
import SocialMedia from '../components/SocialMedia'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { supabase } from '../lib/supabase'

const BASE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Shine On You',
  description: "Scandinavia's premier Pink Floyd tribute band. Performing classics from The Dark Side of the Moon, The Wall, Wish You Were Here and Shine On You Crazy Diamond.",
  url: 'https://shineonyou.no',
  genre: 'Rock',
  foundingLocation: { '@type': 'Place', name: 'Norway' },
}

const TICKET_AVAILABILITY = {
  available: 'https://schema.org/InStock',
  coming_soon: 'https://schema.org/PreOrder',
  sold_out: 'https://schema.org/SoldOut',
}

export default function Home() {
  const [sameAs, setSameAs] = useState([])
  const [nextEvent, setNextEvent] = useState(null)

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    Promise.all([
      supabase
        .from('settings')
        .select('facebook_url, instagram_url, youtube_url')
        .eq('id', 1)
        .single(),
      supabase
        .from('events')
        .select('*')
        .gte('date', today)
        .eq('is_history', false)
        .order('date', { ascending: true })
        .limit(1)
        .single(),
    ]).then(([{ data: settingsData }, { data: eventData }]) => {
      if (settingsData) {
        setSameAs([settingsData.facebook_url, settingsData.instagram_url, settingsData.youtube_url].filter(Boolean))
      }
      if (eventData) setNextEvent(eventData)
    })
  }, [])

  const musicGroupSchema = { ...BASE_SCHEMA, sameAs }

  const nextEventSchema = nextEvent
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicEvent',
        name: `Shine On You – ${nextEvent.venue}`,
        description: `Shine On You live at ${nextEvent.venue} in ${nextEvent.city}. A Pink Floyd tribute concert.`,
        url: nextEvent.ticket_url || 'https://shineonyou.no/tour',
        startDate: nextEvent.date,
        location: {
          '@type': 'Place',
          name: nextEvent.venue,
          address: {
            '@type': 'PostalAddress',
            addressLocality: nextEvent.city,
            addressCountry: nextEvent.country,
          },
        },
        performer: { '@type': 'MusicGroup', name: 'Shine On You', url: 'https://shineonyou.no' },
        organizer: { '@type': 'MusicGroup', name: 'Shine On You', url: 'https://shineonyou.no' },
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        ...(nextEvent.ticket_url && {
          offers: {
            '@type': 'Offer',
            url: nextEvent.ticket_url,
            availability: TICKET_AVAILABILITY[nextEvent.ticket_status] ?? 'https://schema.org/InStock',
          },
        }),
      }
    : null

  return (
    <div className="container">
      <SEO
        title="Shine On You – Pink Floyd Tribute Band"
        description="Shine On You is Scandinavia's premier Pink Floyd tribute band. Performing classics from The Dark Side of the Moon, The Wall and Wish You Were Here and more."
        canonicalPath="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(musicGroupSchema)}</script>
        {nextEventSchema && (
          <script type="application/ld+json">{JSON.stringify(nextEventSchema)}</script>
        )}
      </Helmet>
      <Nav />
      <main id="main-content">
        <h1 className="sr-only">Shine On You</h1>
        <Header />
        <SocialMedia />
      </main>
      <Footer />
    </div>
  )
}

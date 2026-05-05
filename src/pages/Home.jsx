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
  description: 'Pink Floyd tribute band from Norway. Performing classics from The Dark Side of the Moon, The Wall, Wish You Were Here and Shine On You Crazy Diamond.',
  url: 'https://shineonyou.no',
  genre: 'Rock',
  foundingLocation: { '@type': 'Place', name: 'Norway' },
}

export default function Home() {
  const [sameAs, setSameAs] = useState([])

  useEffect(() => {
    supabase
      .from('settings')
      .select('facebook_url, instagram_url, youtube_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSameAs([data.facebook_url, data.instagram_url, data.youtube_url].filter(Boolean))
        }
      })
  }, [])

  const schema = { ...BASE_SCHEMA, sameAs }

  return (
    <div className="container">
      <SEO
        title="Shine On You – Pink Floyd Tribute Band"
        description="Shine On You is Norway's premier Pink Floyd tribute band. Performing classics from The Dark Side of the Moon, The Wall and Wish You Were Here live in Norway, Sweden and Scandinavia."
        canonicalPath="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
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

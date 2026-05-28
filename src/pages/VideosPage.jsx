import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'
import styles from './VideosPage.module.css'

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('videos').select('*').order('sort_order').then(({ data }) => {
      setVideos(data ?? [])
      setLoading(false)
    })
  }, [])

  const videoSchemas = videos.map((v) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: v.title || `Shine On You – ${v.youtube_id}`,
    description: v.title
      ? `${v.title} — live performance by Shine On You, Pink Floyd tribute band.`
      : "Live performance by Shine On You, Scandinavia's Pink Floyd tribute band.",
    embedUrl: `https://www.youtube.com/embed/${v.youtube_id}`,
    thumbnailUrl: `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`,
    url: `https://www.youtube.com/watch?v=${v.youtube_id}`,
    uploadDate: v.created_at
      ? new Date(v.created_at).toISOString().split('T')[0]
      : undefined,
  }))

  return (
    <div className="container">
      <SEO
        title="Videos – Shine On You Pink Floyd Tribute"
        description="Live recordings of Shine On You performing Pink Floyd classics."
        canonicalPath="/videos"
      />
      {videoSchemas.length > 0 && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(videoSchemas)}</script>
        </Helmet>
      )}
      <Nav />
      <main id="main-content">
        <section className={styles.videosPage}>
          <h1>Videos</h1>

          {loading ? (
            <div role="status" aria-label="Loading videos"><div className="events-spinner" /></div>
          ) : videos.length === 0 ? (
            <p className={styles.empty}>No videos have been added yet.</p>
          ) : (
            <div className={styles.videoGrid}>
              {videos.map((v) => (
                <div key={v.id} className={styles.videoItem}>
                  <div className={styles.embedWrapper}>
                    <iframe
                      src={`https://www.youtube.com/embed/${v.youtube_id}`}
                      title={v.title || `Video ${v.youtube_id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {v.title && <p className={styles.videoTitle}>{v.title}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

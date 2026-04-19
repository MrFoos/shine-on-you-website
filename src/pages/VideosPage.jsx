import { useEffect, useState } from 'react'
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

  return (
    <div className="container">
      <SEO
        title="Videos – Shine On You Pink Floyd Tribute"
        description="Se videoer fra Shine On You, Norges fremste Pink Floyd-tributeband."
        canonicalPath="/videos"
      />
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

import { useState, useEffect, useCallback } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { supabase } from '../lib/supabase'
import SEO from '../components/SEO'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [photoCredit, setPhotoCredit] = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: imgs }, { data: settings }] = await Promise.all([
        supabase.from('gallery').select('*').order('sort_order'),
        supabase.from('settings').select('gallery_photo_credit').eq('id', 1).single(),
      ])
      setImages(imgs ?? [])
      setPhotoCredit(settings?.gallery_photo_credit ?? '')
      setLoading(false)
    }
    fetchData()
  }, [])

  const getUrl = (path) =>
    supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl

  const close = useCallback(() => setSelected(null), [])

  const prev = useCallback(() => {
    setSelected(i => (i - 1 + images.length) % images.length)
  }, [images.length])

  const next = useCallback(() => {
    setSelected(i => (i + 1) % images.length)
  }, [images.length])

  useEffect(() => {
    if (selected === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, close, prev, next])

  return (
    <div className="container">
      <SEO
        title="Bilder – Shine On You Pink Floyd Tribute"
        description="Fotogalleri fra Shine On You sine konserter og opptredener."
        canonicalPath="/gallery"
      />
      <Nav />
      <section className={styles.galleryPage}>
        <h2>Gallery</h2>

        {loading ? (
          <div className="events-spinner" />
        ) : (
          <>
            <div className={styles.galleryGrid}>
              {images.map((img, i) => (
                <button
                  key={img.id}
                  className={styles.galleryItem}
                  onClick={() => setSelected(i)}
                  aria-label={`Open photo ${i + 1}`}
                >
                  <img src={getUrl(img.storage_path)} alt={img.alt} loading="lazy" />
                </button>
              ))}
            </div>

            {photoCredit && (
              <p className={styles.galleryPhotoCredit}>Photos: {photoCredit}</p>
            )}
          </>
        )}
      </section>
      <Footer />

      {selected !== null && (
        <div className={styles.lightbox} onClick={close}>
          <button className={styles.lightboxClose} onClick={close} aria-label="Close">✕</button>
          <button
            className={styles.lightboxPrev}
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous"
          >‹</button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={getUrl(images[selected].storage_path)} alt={images[selected].alt} />
          </div>
          <button
            className={styles.lightboxNext}
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next"
          >›</button>
        </div>
      )}
    </div>
  )
}

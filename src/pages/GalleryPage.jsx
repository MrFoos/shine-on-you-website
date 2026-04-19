import { useState, useEffect, useCallback, useRef } from 'react'
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
  const lightboxRef = useRef(null)
  const closeButtonRef = useRef(null)
  const triggerRef = useRef(null)

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

  // Flytt fokus til lukk-knappen når lightboxen åpnes
  useEffect(() => {
    if (selected !== null && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [selected])

  // Returner fokus til trigger-knappen når lightboxen lukkes
  useEffect(() => {
    if (selected === null && triggerRef.current) {
      triggerRef.current.focus()
    }
  }, [selected])

  // Fokusfelle: Tab-tasten sirkler inni lightboxen
  useEffect(() => {
    if (selected === null || !lightboxRef.current) return
    const el = lightboxRef.current
    const focusable = el.querySelectorAll('button')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trapFocus = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    el.addEventListener('keydown', trapFocus)
    return () => el.removeEventListener('keydown', trapFocus)
  }, [selected])

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
      <main id="main-content">
      <section className={styles.galleryPage}>
        <h1>Gallery</h1>

        {loading ? (
          <div role="status" aria-label="Loading images"><div className="events-spinner" /></div>
        ) : (
          <>
            <div className={styles.galleryGrid}>
              {images.map((img, i) => (
                <button
                  key={img.id}
                  className={styles.galleryItem}
                  onClick={(e) => { triggerRef.current = e.currentTarget; setSelected(i) }}
                  aria-label={`Open image ${i + 1}`}
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
      </main>
      <Footer />

      {selected !== null && (
        <div
          ref={lightboxRef}
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${selected + 1} of ${images.length}`}
          onClick={close}
        >
          <button
            ref={closeButtonRef}
            className={styles.lightboxClose}
            onClick={close}
            aria-label="Close gallery"
          >✕</button>
          <button
            className={styles.lightboxPrev}
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous image"
          >‹</button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img src={getUrl(images[selected].storage_path)} alt={images[selected].alt} />
          </div>
          <button
            className={styles.lightboxNext}
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next image"
          >›</button>
        </div>
      )}
    </div>
  )
}

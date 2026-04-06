import { useState, useEffect, useCallback } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const IMAGES = [
  { src: '/images/gallery/P1092034Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1092053Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1092391Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1092520Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1092521Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1092557Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1092593Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1102743Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1103000Shine25@EspenHåkonsen47754888.webp', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1092462Shine25@EspenHåkonsen47754888.jpg', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1092578Shine25@EspenHåkonsen47754888.jpg', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/P1102820Shine25@EspenHåkonsen47754888.jpg', alt: 'Shine On You live', photographer: 'Espen Håkonsen' },
  { src: '/images/gallery/4R6A9676.jpg', alt: 'Shine On You live', photographer: 'Patrik Skiffard' },
  { src: '/images/gallery/4R6A9677.jpg', alt: 'Shine On You live', photographer: 'Patrik Skiffard' },
  { src: '/images/gallery/4R6A9678.jpg', alt: 'Shine On You live', photographer: 'Patrik Skiffard' },
  { src: '/images/gallery/4R6A9680.jpg', alt: 'Shine On You live', photographer: 'Patrik Skiffard' },
  { src: '/images/gallery/4R6A9681.jpg', alt: 'Shine On You live', photographer: 'Patrik Skiffard' },
  { src: '/images/gallery/4R6A9684.jpg', alt: 'Shine On You live', photographer: 'Patrik Skiffard' },
  { src: '/images/gallery/4R6A9698.jpg', alt: 'Shine On You live', photographer: 'Patrik Skiffard' },
  { src: '/images/gallery/4R6A1303.jpg', alt: 'Shine On You live', photographer: 'Patrik Skiffard' },
]

const PHOTOGRAPHERS = [...new Set(IMAGES.map(img => img.photographer))]

export default function GalleryPage() {
  const [selected, setSelected] = useState(null)

  const close = useCallback(() => setSelected(null), [])

  const prev = useCallback(() => {
    setSelected(i => (i - 1 + IMAGES.length) % IMAGES.length)
  }, [])

  const next = useCallback(() => {
    setSelected(i => (i + 1) % IMAGES.length)
  }, [])

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
      <Nav />
      <section className="gallery-page">
        <h2>Gallery</h2>

        <div className="gallery-grid">
          {IMAGES.map((img, i) => (
            <button
              key={i}
              className="gallery-item"
              onClick={() => setSelected(i)}
              aria-label={`Open photo ${i + 1}`}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
            </button>
          ))}
        </div>

        <p className="gallery-photo-credit">
          Photos: {PHOTOGRAPHERS.join(', ')}
        </p>
      </section>
      <Footer />

      {selected !== null && (
        <div className="lightbox" onClick={close}>
          <button className="lightbox-close" onClick={close} aria-label="Close">✕</button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous"
          >‹</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={IMAGES[selected].src} alt={IMAGES[selected].alt} />
          </div>
          <button
            className="lightbox-next"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next"
          >›</button>
        </div>
      )}
    </div>
  )
}

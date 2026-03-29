import { useState } from 'react'

const IMAGES = [
  'P1092593Shine25@EspenHåkonsen47754888.webp',
  'P1092053Shine25@EspenHåkonsen47754888.webp',
  'P1092557Shine25@EspenHåkonsen47754888.webp',
  'P1092034Shine25@EspenHåkonsen47754888.webp',
  'P1102743Shine25@EspenHåkonsen47754888.webp',
  'P1103000Shine25@EspenHåkonsen47754888.webp',
  'P1092391Shine25@EspenHåkonsen47754888.webp',
  'P1092520Shine25@EspenHåkonsen47754888.webp',
  'P1092521Shine25@EspenHåkonsen47754888.webp',
  'IMG_0055A97A8E95-1.webp',
  'IMG_25C536F779A3-1.webp',
  'IMG_3DBE2EF3CF48-1.webp',
  'IMG_A3DD621C5620-1.webp',
  'IMG_CCBD63C378ED-1.webp',
  'IMG_EBD8FCF994F8-1.webp',
]

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const prev = () => setLightboxIndex((i) => (i - 1 + IMAGES.length) % IMAGES.length)
  const next = () => setLightboxIndex((i) => (i + 1) % IMAGES.length)

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightboxIndex(null)
  }

  return (
    <section id="gallery" className="gallery">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {IMAGES.map((filename, index) => (
          <img
            key={filename}
            src={`/images/${filename}`}
            alt={`Gallery photo ${index + 1}`}
            className="gallery-thumb"
            loading="lazy"
            onClick={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxIndex(null)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Image lightbox"
        >
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <img
            src={`/images/${IMAGES[lightboxIndex]}`}
            alt={`Gallery photo ${lightboxIndex + 1}`}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next image"
          >
            &#8250;
          </button>
          <button
            className="lightbox-close"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close lightbox"
          >
            &times;
          </button>
        </div>
      )}
    </section>
  )
}

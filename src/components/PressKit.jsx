// TODO: Add files to public/presskit/ before enabling this component:
//   - presskit.pdf (band press kit)
//   - venue-kit.pdf (venue/technical rider)
//   - logo.png (high-res logo for download)

const DOWNLOADS = [
  { label: 'Download Press Kit', file: '/presskit/presskit.pdf' },
  { label: 'Download Venue Kit', file: '/presskit/venue-kit.pdf' },
  { label: 'Download Logo', file: '/presskit/logo.png' },
]

export default function PressKit() {
  return (
    <section id="presskit" className="presskit">
      <h2>Press Kit</h2>
      <div className="presskit-buttons">
        {DOWNLOADS.map(({ label, file }) => (
          <a key={file} href={file} download className="presskit-btn">
            {label}
          </a>
        ))}
      </div>
    </section>
  )
}

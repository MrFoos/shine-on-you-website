// TODO: Replace VIDEO_IDS with actual YouTube video IDs from the band's channel
const VIDEO_IDS = [
  'PLACEHOLDER_VIDEO_ID_1',
  'PLACEHOLDER_VIDEO_ID_2',
  'PLACEHOLDER_VIDEO_ID_3',
]

export default function Music() {
  return (
    <section id="music" className="music">
      <h2>Music</h2>
      <div className="music-videos">
        {VIDEO_IDS.map((id) => (
          <div key={id} className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${id}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </section>
  )
}

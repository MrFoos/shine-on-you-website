import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function VideoManager() {
  const [videos, setVideos] = useState([])
  const [youtubeId, setYoutubeId] = useState('')
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)

  const fetch = async () => {
    const { data } = await supabase.from('videos').select('*').order('sort_order')
    setVideos(data ?? [])
  }

  useEffect(() => { fetch() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    await supabase.from('videos').insert([{ youtube_id: youtubeId.trim(), title, sort_order: videos.length }])
    setYoutubeId('')
    setTitle('')
    setAdding(false)
    fetch()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Slette denne videoen?')) return
    await supabase.from('videos').delete().eq('id', id)
    fetch()
  }

  return (
    <div className="admin-editor">
      <form className="admin-form" onSubmit={handleAdd}>
        <div className="admin-form-row">
          <label>YouTube Video ID</label>
          <input
            type="text"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder="f.eks. dQw4w9WgXcQ"
            required
          />
        </div>
        <div className="admin-form-row">
          <label>Tittel (valgfritt)</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="admin-form-actions">
          <button type="submit" disabled={adding}>{adding ? 'Legger til…' : 'Legg til video'}</button>
        </div>
      </form>

      <div className="admin-video-list">
        {videos.map((v) => (
          <div key={v.id} className="admin-video-item">
            <span>{v.title || v.youtube_id}</span>
            <a href={`https://www.youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noreferrer">Se</a>
            <button onClick={() => handleDelete(v.id)}>Slett</button>
          </div>
        ))}
      </div>
    </div>
  )
}

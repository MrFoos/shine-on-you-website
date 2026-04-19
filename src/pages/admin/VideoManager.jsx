import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import shared from './AdminShared.module.css'

export default function VideoManager() {
  const [videos, setVideos] = useState([])
  const [youtubeId, setYoutubeId] = useState('')
  const [title, setTitle] = useState('')
  const [adding, setAdding] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editFields, setEditFields] = useState({ youtube_id: '', title: '' })
  const dragIndexRef = useRef(null)

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

  const handleEditStart = (v) => {
    setEditingId(v.id)
    setEditFields({ youtube_id: v.youtube_id, title: v.title ?? '' })
  }

  const handleEditSave = async () => {
    await supabase.from('videos')
      .update({ youtube_id: editFields.youtube_id.trim(), title: editFields.title })
      .eq('id', editingId)
    setEditingId(null)
    fetch()
  }

  const handleEditCancel = () => {
    setEditingId(null)
  }

  const handleDragStart = (index) => {
    dragIndexRef.current = index
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = dragIndexRef.current
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragOverIndex(null)
      return
    }

    const reordered = [...videos]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)

    setVideos(reordered)
    setDragOverIndex(null)
    dragIndexRef.current = null

    await Promise.all(
      reordered.map((v, i) =>
        supabase.from('videos').update({ sort_order: i }).eq('id', v.id)
      )
    )
  }

  const handleDragEnd = () => {
    setDragOverIndex(null)
    dragIndexRef.current = null
  }

  return (
    <div className={shared.editor}>
      <form className={shared.form} onSubmit={handleAdd}>
        <div className={shared.formRow}>
          <label>YouTube Video ID</label>
          <input
            type="text"
            value={youtubeId}
            onChange={(e) => setYoutubeId(e.target.value)}
            placeholder="f.eks. dQw4w9WgXcQ"
            required
          />
        </div>
        <div className={shared.formRow}>
          <label>Tittel (valgfritt)</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className={shared.formActions}>
          <button type="submit" disabled={adding}>{adding ? 'Legger til…' : 'Legg til video'}</button>
        </div>
      </form>

      <div className={shared.videoList}>
        {videos.map((v, i) => (
          <div
            key={v.id}
            className={`${shared.videoItem}${dragOverIndex === i ? ` ${shared.videoDragOver}` : ''}`}
            draggable={editingId === null}
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
          >
            {editingId === v.id ? (
              <>
                <div className={shared.formRow} style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={editFields.youtube_id}
                    onChange={(e) => setEditFields(f => ({ ...f, youtube_id: e.target.value }))}
                    placeholder="YouTube Video ID"
                  />
                </div>
                <div className={shared.formRow} style={{ flex: 2 }}>
                  <input
                    type="text"
                    value={editFields.title}
                    onChange={(e) => setEditFields(f => ({ ...f, title: e.target.value }))}
                    placeholder="Tittel (valgfritt)"
                  />
                </div>
                <div className={shared.formActions}>
                  <button type="button" onClick={handleEditSave}>Lagre</button>
                  <button type="button" onClick={handleEditCancel}>Avbryt</button>
                </div>
              </>
            ) : (
              <>
                <span>⠿</span>
                <span>{v.title || v.youtube_id}</span>
                <a href={`https://www.youtube.com/watch?v=${v.youtube_id}`} target="_blank" rel="noreferrer">Se</a>
                <button type="button" onClick={() => handleEditStart(v)}>Endre</button>
                <button type="button" onClick={() => handleDelete(v.id)}>Slett</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

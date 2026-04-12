import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import shared from './AdminShared.module.css'

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const dragIndexRef = useRef(null)
  const fileInputRef = useRef(null)

  const fetchImages = async () => {
    const { data } = await supabase.from('gallery').select('*').order('sort_order')
    setImages(data ?? [])
  }

  useEffect(() => { fetchImages() }, [])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)

    let nextOrder = images.length
    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${Date.now()}-${safeName}`
      const { error } = await supabase.storage.from('gallery').upload(path, file)
      if (!error) {
        await supabase.from('gallery').insert([{
          storage_path: path,
          alt: file.name,
          sort_order: nextOrder++,
        }])
      }
    }

    setUploading(false)
    fileInputRef.current.value = ''
    fetchImages()
  }

  const handleDelete = async (image) => {
    if (!window.confirm('Slette dette bildet?')) return
    await supabase.storage.from('gallery').remove([image.storage_path])
    await supabase.from('gallery').delete().eq('id', image.id)
    fetchImages()
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

    const reordered = [...images]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)

    setImages(reordered)
    setDragOverIndex(null)
    dragIndexRef.current = null

    await Promise.all(
      reordered.map((img, i) =>
        supabase.from('gallery').update({ sort_order: i }).eq('id', img.id)
      )
    )
  }

  const handleDragEnd = () => {
    setDragOverIndex(null)
    dragIndexRef.current = null
  }

  const getUrl = (path) =>
    supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl

  return (
    <div className={shared.editor}>
      <div className={shared.upload}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={uploading}
        />
        {uploading && <span>Laster opp…</span>}
      </div>

      <div className={shared.galleryGrid}>
        {images.map((img, i) => (
          <div
            key={img.id}
            className={`${shared.galleryItem}${dragOverIndex === i ? ` ${shared.dragOver}` : ''}`}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
          >
            <img src={getUrl(img.storage_path)} alt={img.alt} />
            <button onClick={() => handleDelete(img)}>Slett</button>
          </div>
        ))}
      </div>
    </div>
  )
}

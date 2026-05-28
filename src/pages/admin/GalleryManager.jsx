import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { storageUpload, storageRemove } from '../../lib/auditStorage'
import shared from './AdminShared.module.css'

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [editingAlt, setEditingAlt] = useState({})
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
      const { error } = await storageUpload('gallery', path, file)
      if (!error) {
        await supabase.from('gallery').insert([{
          storage_path: path,
          alt: '',
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
    await storageRemove('gallery', [image.storage_path])
    await supabase.from('gallery').delete().eq('id', image.id)
    fetchImages()
  }

  const handleAltChange = (id, value) => {
    setEditingAlt((prev) => ({ ...prev, [id]: value }))
  }

  const handleAltSave = async (id) => {
    const value = editingAlt[id]
    if (value === undefined) return
    await supabase.from('gallery').update({ alt: value }).eq('id', id)
    setImages((prev) => prev.map((img) => img.id === id ? { ...img, alt: value } : img))
    setEditingAlt((prev) => { const n = { ...prev }; delete n[id]; return n })
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
        {images.map((img, i) => {
          const currentAlt = editingAlt[img.id] !== undefined ? editingAlt[img.id] : img.alt
          const isEmpty = !img.alt && editingAlt[img.id] === undefined
          return (
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
              <div className={shared.galleryAltRow}>
                <input
                  type="text"
                  placeholder="Alt-tekst (beskriv bildet for SEO)"
                  value={currentAlt}
                  onChange={(e) => handleAltChange(img.id, e.target.value)}
                  onBlur={() => handleAltSave(img.id)}
                  className={isEmpty ? shared.altInputWarning : undefined}
                  aria-label="Alt-tekst for bilde"
                />
                {isEmpty && (
                  <span className={shared.altWarning} title="Tom alt-tekst er dårlig for SEO og tilgjengelighet">⚠</span>
                )}
              </div>
              <button onClick={() => handleDelete(img)}>Slett</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

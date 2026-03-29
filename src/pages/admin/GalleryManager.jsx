import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const fetch = async () => {
    const { data } = await supabase.from('gallery').select('*').order('sort_order')
    setImages(data ?? [])
  }

  useEffect(() => { fetch() }, [])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)

    for (const file of files) {
      const path = `${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('gallery').upload(path, file)
      if (!error) {
        await supabase.from('gallery').insert([{
          storage_path: path,
          alt: file.name,
          sort_order: images.length,
        }])
      }
    }

    setUploading(false)
    fileInputRef.current.value = ''
    fetch()
  }

  const handleDelete = async (image) => {
    if (!window.confirm('Slette dette bildet?')) return
    await supabase.storage.from('gallery').remove([image.storage_path])
    await supabase.from('gallery').delete().eq('id', image.id)
    fetch()
  }

  const getUrl = (path) =>
    supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl

  return (
    <div className="admin-editor">
      <div className="admin-upload">
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

      <div className="admin-gallery-grid">
        {images.map((img) => (
          <div key={img.id} className="admin-gallery-item">
            <img src={getUrl(img.storage_path)} alt={img.alt} />
            <button onClick={() => handleDelete(img)}>Slett</button>
          </div>
        ))}
      </div>
    </div>
  )
}

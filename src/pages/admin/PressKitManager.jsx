import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function PressKitManager() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [label, setLabel] = useState('')
  const fileInputRef = useRef(null)

  const fetch = async () => {
    const { data } = await supabase.from('presskit_files').select('*').order('created_at')
    setFiles(data ?? [])
  }

  useEffect(() => { fetch() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !label.trim()) return
    setUploading(true)

    const path = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('presskit').upload(path, file)
    if (!error) {
      await supabase.from('presskit_files').insert([{ label: label.trim(), storage_path: path }])
    }

    setLabel('')
    fileInputRef.current.value = ''
    setUploading(false)
    fetch()
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Slette "${item.label}"?`)) return
    await supabase.storage.from('presskit').remove([item.storage_path])
    await supabase.from('presskit_files').delete().eq('id', item.id)
    fetch()
  }

  const getUrl = (path) =>
    supabase.storage.from('presskit').getPublicUrl(path).data.publicUrl

  return (
    <div className="admin-editor">
      <div className="admin-form">
        <div className="admin-form-row">
          <label>Etikett</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="f.eks. Press Kit, Venue Kit, Logo"
          />
        </div>
        <div className="admin-form-row">
          <label>Fil</label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            disabled={uploading || !label.trim()}
          />
        </div>
        {uploading && <span>Laster opp…</span>}
      </div>

      <div className="admin-file-list">
        {files.map((f) => (
          <div key={f.id} className="admin-file-item">
            <span>{f.label}</span>
            <a href={getUrl(f.storage_path)} target="_blank" rel="noreferrer">Last ned</a>
            <button onClick={() => handleDelete(f)}>Slett</button>
          </div>
        ))}
      </div>
    </div>
  )
}

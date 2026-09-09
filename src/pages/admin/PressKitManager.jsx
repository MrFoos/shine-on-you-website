import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { storageUpload, storageRemove } from '../../lib/auditStorage'
import { sortPressKitFiles } from '../../lib/presskit'
import shared from './AdminShared.module.css'

export default function PressKitManager() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [label, setLabel] = useState('')
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const dragIndexRef = useRef(null)
  const fileInputRef = useRef(null)

  const fetch = async () => {
    const { data, error } = await supabase.from('presskit_files').select('*')
    if (error) {
      setError(`Kunne ikke hente filene: ${error.message}`)
      return
    }
    setFiles(sortPressKitFiles(data))
  }

  useEffect(() => { fetch() }, [])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !label.trim()) return
    setUploading(true)
    setError('')

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${Date.now()}-${safeName}`
    const { error: uploadError } = await storageUpload('presskit', path, file)

    if (uploadError) {
      setError(`Opplastingen feilet: ${uploadError.message}`)
    } else {
      const { error: insertError } = await supabase
        .from('presskit_files')
        .insert([{ label: label.trim(), storage_path: path, sort_order: files.length }])

      if (insertError) {
        // Fila ligger i storage, men uten rad er den usynlig — rydd opp, ellers
        // blir den liggende som søppel ingen ser eller kan slette fra admin.
        await storageRemove('presskit', [path])
        setError(`Kunne ikke lagre fila: ${insertError.message}`)
      } else {
        setLabel('')
      }
    }

    fileInputRef.current.value = ''
    setUploading(false)
    fetch()
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Slette "${item.label}"?`)) return
    setError('')

    const { error: removeError } = await storageRemove('presskit', [item.storage_path])
    if (removeError) {
      setError(`Kunne ikke slette fila: ${removeError.message}`)
      return
    }

    const { error: deleteError } = await supabase
      .from('presskit_files')
      .delete()
      .eq('id', item.id)

    if (deleteError) setError(`Kunne ikke slette raden: ${deleteError.message}`)
    fetch()
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

    const reordered = [...files]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)

    setFiles(reordered)
    setDragOverIndex(null)
    dragIndexRef.current = null

    const results = await Promise.all(
      reordered.map((f, i) =>
        supabase.from('presskit_files').update({ sort_order: i }).eq('id', f.id)
      )
    )

    const failed = results.find((r) => r.error)
    if (failed) setError(`Kunne ikke lagre rekkefølgen: ${failed.error.message}`)
  }

  const handleDragEnd = () => {
    setDragOverIndex(null)
    dragIndexRef.current = null
  }

  const getUrl = (path) =>
    supabase.storage.from('presskit').getPublicUrl(path).data.publicUrl

  return (
    <div className={shared.editor}>
      <p className={shared.fieldHint}>
        Filene vises på shineonyou.no/press, under logoene. Dra for å sortere.
        Logoene ligger i koden og styres ikke herfra.
      </p>

      {error && <p className={shared.error}>{error}</p>}

      <div className={shared.form}>
        <div className={shared.formRow}>
          <label>Etikett</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="f.eks. Teknisk rider, Stageplot"
          />
        </div>
        <div className={shared.formRow}>
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

      <div className={shared.fileList}>
        {files.map((f, i) => (
          <div
            key={f.id}
            className={`${shared.fileItem}${dragOverIndex === i ? ` ${shared.videoDragOver}` : ''}`}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
          >
            <span>{f.label}</span>
            <a href={getUrl(f.storage_path)} target="_blank" rel="noreferrer">Last ned</a>
            <button onClick={() => handleDelete(f)}>Slett</button>
          </div>
        ))}
      </div>
    </div>
  )
}

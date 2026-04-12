import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import shared from './AdminShared.module.css'

export default function BandMembersManager() {
  const [members, setMembers] = useState([])
  const [uploading, setUploading] = useState(false)
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const dragIndexRef = useRef(null)
  const fileInputRef = useRef(null)

  const fetchMembers = async () => {
    const { data } = await supabase.from('members').select('*').order('sort_order')
    setMembers(data ?? [])
  }

  useEffect(() => { fetchMembers() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    const file = fileInputRef.current?.files[0]
    if (!file || !newName.trim() || !newRole.trim()) return
    setUploading(true)

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${Date.now()}-${safeName}`
    const { error } = await supabase.storage.from('members').upload(path, file)
    if (!error) {
      await supabase.from('members').insert([{
        name: newName.trim(),
        role: newRole.trim(),
        storage_path: path,
        sort_order: members.length,
      }])
    }

    setNewName('')
    setNewRole('')
    fileInputRef.current.value = ''
    setUploading(false)
    fetchMembers()
  }

  const handleSave = async (member) => {
    await supabase.from('members')
      .update({ name: member.name, role: member.role })
      .eq('id', member.id)
  }

  const handleDelete = async (member) => {
    if (!window.confirm(`Slette ${member.name}?`)) return
    await supabase.storage.from('members').remove([member.storage_path])
    await supabase.from('members').delete().eq('id', member.id)
    fetchMembers()
  }

  const handleFieldChange = (id, field, value) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
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

    const reordered = [...members]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)

    setMembers(reordered)
    setDragOverIndex(null)
    dragIndexRef.current = null

    await Promise.all(
      reordered.map((m, i) =>
        supabase.from('members').update({ sort_order: i }).eq('id', m.id)
      )
    )
  }

  const handleDragEnd = () => {
    setDragOverIndex(null)
    dragIndexRef.current = null
  }

  const getUrl = (path) =>
    supabase.storage.from('members').getPublicUrl(path).data.publicUrl

  return (
    <div className={shared.editor}>
      <form onSubmit={handleUpload} className={shared.form}>
        <div className={shared.formRow}>
          <label>Navn</label>
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Fullt navn"
            required
          />
        </div>
        <div className={shared.formRow}>
          <label>Rolle</label>
          <input
            type="text"
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            placeholder="Instrument / rolle"
            required
          />
        </div>
        <div className={shared.upload}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            required
          />
          <button type="submit" disabled={uploading}>
            {uploading ? 'Laster opp…' : 'Legg til medlem'}
          </button>
        </div>
      </form>

      <div className={shared.galleryGrid}>
        {members.map((member, i) => (
          <div
            key={member.id}
            className={`${shared.galleryItem}${dragOverIndex === i ? ` ${shared.dragOver}` : ''}`}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
            onDragEnd={handleDragEnd}
          >
            <img src={getUrl(member.storage_path)} alt={member.name} />
            <input
              type="text"
              value={member.name}
              onChange={e => handleFieldChange(member.id, 'name', e.target.value)}
              onBlur={() => handleSave(member)}
            />
            <input
              type="text"
              value={member.role}
              onChange={e => handleFieldChange(member.id, 'role', e.target.value)}
              onBlur={() => handleSave(member)}
            />
            <button onClick={() => handleDelete(member)}>Slett</button>
          </div>
        ))}
      </div>
    </div>
  )
}

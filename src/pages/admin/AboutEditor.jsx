import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AboutEditor() {
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('about').select('bio').eq('id', 1).single()
      .then(({ data }) => { if (data) setBio(data.bio) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('about').update({ bio, updated_at: new Date().toISOString() }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="admin-editor">
      <textarea
        rows={8}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Skriv band-bio her…"
      />
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Lagrer…' : saved ? 'Lagret!' : 'Lagre'}
      </button>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import shared from './AdminShared.module.css'

export default function ContactEditor() {
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('contact').select('email').eq('id', 1).single()
      .then(({ data }) => { if (data) setEmail(data.email) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('contact').update({ email, updated_at: new Date().toISOString() }).eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={shared.editor}>
      <div className={shared.formRow}>
        <label>Kontakt-epost</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="band@eksempel.no"
        />
      </div>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Lagrer…' : saved ? 'Lagret!' : 'Lagre'}
      </button>
    </div>
  )
}

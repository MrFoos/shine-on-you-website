import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SiteSettingsEditor() {
  const [tourHeading, setTourHeading] = useState('')
  const [pastShowsHeading, setPastShowsHeading] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('settings')
      .select('tour_heading, past_shows_heading')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setTourHeading(data.tour_heading)
          setPastShowsHeading(data.past_shows_heading)
        }
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('settings')
      .update({
        tour_heading: tourHeading,
        past_shows_heading: pastShowsHeading,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="admin-editor">
      <div className="admin-form-row">
        <label>Tour-overskrift</label>
        <input
          type="text"
          value={tourHeading}
          onChange={(e) => setTourHeading(e.target.value)}
          placeholder="Tour 2026"
        />
      </div>
      <div className="admin-form-row">
        <label>Tidligere shows-overskrift</label>
        <input
          type="text"
          value={pastShowsHeading}
          onChange={(e) => setPastShowsHeading(e.target.value)}
          placeholder="Past shows 2026"
        />
      </div>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Lagrer…' : saved ? 'Lagret!' : 'Lagre'}
      </button>
    </div>
  )
}

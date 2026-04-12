import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import shared from './AdminShared.module.css'

export default function SiteSettingsEditor() {
  const [tourHeading, setTourHeading] = useState('')
  const [pastShowsHeading, setPastShowsHeading] = useState('')
  const [galleryCredit, setGalleryCredit] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('settings')
      .select('tour_heading, past_shows_heading, gallery_photo_credit')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setTourHeading(data.tour_heading)
          setPastShowsHeading(data.past_shows_heading)
          setGalleryCredit(data.gallery_photo_credit ?? '')
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
        gallery_photo_credit: galleryCredit,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={shared.editor}>
      <div className={shared.formRow}>
        <label>Tour-overskrift</label>
        <input
          type="text"
          value={tourHeading}
          onChange={(e) => setTourHeading(e.target.value)}
          placeholder="Tour 2026"
        />
      </div>
      <div className={shared.formRow}>
        <label>Tidligere shows-overskrift</label>
        <input
          type="text"
          value={pastShowsHeading}
          onChange={(e) => setPastShowsHeading(e.target.value)}
          placeholder="Past shows 2026"
        />
      </div>
      <div className={shared.formRow}>
        <label>Fotokreditering (galleri)</label>
        <input
          type="text"
          value={galleryCredit}
          onChange={(e) => setGalleryCredit(e.target.value)}
          placeholder="Espen Håkonsen, Patrik Skiffard"
        />
      </div>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Lagrer…' : saved ? 'Lagret!' : 'Lagre'}
      </button>
    </div>
  )
}

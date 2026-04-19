import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import shared from './AdminShared.module.css'

export default function SiteSettingsEditor() {
  const [tourHeading, setTourHeading] = useState('')
  const [pastShowsHeading, setPastShowsHeading] = useState('')
  const [galleryCredit, setGalleryCredit] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [instagramUrl, setInstagramUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase
      .from('settings')
      .select('tour_heading, past_shows_heading, gallery_photo_credit, facebook_url, instagram_url, youtube_url')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setTourHeading(data.tour_heading)
          setPastShowsHeading(data.past_shows_heading)
          setGalleryCredit(data.gallery_photo_credit ?? '')
          setFacebookUrl(data.facebook_url ?? '')
          setInstagramUrl(data.instagram_url ?? '')
          setYoutubeUrl(data.youtube_url ?? '')
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
        facebook_url: facebookUrl,
        instagram_url: instagramUrl,
        youtube_url: youtubeUrl,
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
      <div className={shared.formRow}>
        <label>Facebook URL</label>
        <input
          type="url"
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e.target.value)}
          placeholder="https://www.facebook.com/..."
        />
      </div>
      <div className={shared.formRow}>
        <label>Instagram URL</label>
        <input
          type="url"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          placeholder="https://www.instagram.com/..."
        />
      </div>
      <div className={shared.formRow}>
        <label>YouTube URL</label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/..."
        />
      </div>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Lagrer…' : saved ? 'Lagret!' : 'Lagre'}
      </button>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { storageUpload, storageRemove } from '../../lib/auditStorage'
import shared from './AdminShared.module.css'

const BUCKET = 'hero'

export default function ForsidaEditor() {
  const [form, setForm] = useState({
    hero_eyebrow: '',
    hero_tagline: '',
    hero_background_image: '',
    hero_overlay_opacity: 0.65,
    hero_cta_primary_label: '',
    hero_cta_primary_href: '',
    hero_cta_secondary_label: '',
    hero_cta_secondary_href: '',
    next_show_kicker: '',
    between_tours_eyebrow: '',
    between_tours_heading: '',
    between_tours_body: '',
    social_kicker: '',
    hero_card_align: 'top',
    hero_card_opacity: 0.82,
    hero_card_visible: true,
    hero_background_credit: '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    supabase
      .from('settings')
      .select(
        'hero_eyebrow, hero_tagline, hero_background_image, hero_overlay_opacity, ' +
        'hero_cta_primary_label, hero_cta_primary_href, hero_cta_secondary_label, hero_cta_secondary_href, ' +
        'next_show_kicker, between_tours_eyebrow, between_tours_heading, between_tours_body, social_kicker, ' +
        'hero_card_align, hero_card_opacity, hero_card_visible, hero_background_credit'
      )
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm(prev => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(data).map(([k, v]) => [k, v ?? prev[k]])
            ),
          }))
        }
      })
  }, [])

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))
  const setNum = (key) => (e) => setForm(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))
  const setBool = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.checked }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${Date.now()}-${safeName}`
    const { error } = await storageUpload(BUCKET, path, file, { upsert: false })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
      setForm(prev => ({ ...prev, hero_background_image: publicUrl }))
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleImageRemove = async () => {
    const url = form.hero_background_image
    if (!url) return
    const parts = url.split(`/${BUCKET}/`)
    if (parts[1]) await storageRemove(BUCKET, [parts[1]])
    setForm(prev => ({ ...prev, hero_background_image: '' }))
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('settings')
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq('id', 1)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={shared.editor}>
      <h2>Hero</h2>

      <div className={shared.formRow}>
        <label>Eyebrow</label>
        <input type="text" value={form.hero_eyebrow} onChange={set('hero_eyebrow')} placeholder="Pink Floyd Tribute · Est. 2017" />
      </div>

      <div className={shared.formRow}>
        <label>Tagline</label>
        <input type="text" value={form.hero_tagline} onChange={set('hero_tagline')} placeholder="A powerful tribute…" />
      </div>

      <div className={shared.formRow}>
        <label>Background image</label>
        {form.hero_background_image ? (
          <div>
            <img
              src={form.hero_background_image}
              alt="Hero background"
              style={{ maxWidth: '320px', maxHeight: '180px', display: 'block', marginBottom: '8px', objectFit: 'cover' }}
            />
            <button type="button" onClick={handleImageRemove}>Remove image</button>
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <span> Uploading…</span>}
          </div>
        )}
      </div>

      <div className={shared.formRow}>
        <label>Fotokreditering (forside)</label>
        <input type="text" value={form.hero_background_credit} onChange={set('hero_background_credit')} placeholder="Espen Håkonsen" />
      </div>

      <div className={shared.formRow}>
        <label>Overlay opacity (0–1)</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={form.hero_overlay_opacity}
          onChange={setNum('hero_overlay_opacity')}
          style={{ width: '200px' }}
        />
        <span style={{ marginLeft: '8px', color: '#aaa' }}>{form.hero_overlay_opacity}</span>
      </div>

      <h2>Primary CTA</h2>

      <div className={shared.formRow}>
        <label>Label</label>
        <input type="text" value={form.hero_cta_primary_label} onChange={set('hero_cta_primary_label')} placeholder="All concerts →" />
      </div>
      <div className={shared.formRow}>
        <label>Link</label>
        <input type="text" value={form.hero_cta_primary_href} onChange={set('hero_cta_primary_href')} placeholder="/tour" />
      </div>

      <h2>Secondary CTA</h2>

      <div className={shared.formRow}>
        <label>Label</label>
        <input type="text" value={form.hero_cta_secondary_label} onChange={set('hero_cta_secondary_label')} placeholder="Book us" />
      </div>
      <div className={shared.formRow}>
        <label>Link</label>
        <input type="text" value={form.hero_cta_secondary_href} onChange={set('hero_cta_secondary_href')} placeholder="mailto:…" />
      </div>

      <h2>Next Show card</h2>

      <div className={shared.formRow}>
        <label>Show card</label>
        <input
          type="checkbox"
          checked={form.hero_card_visible}
          onChange={setBool('hero_card_visible')}
        />
      </div>

      <div className={shared.formRow}>
        <label>Card alignment</label>
        <select value={form.hero_card_align} onChange={set('hero_card_align')}>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>

      <div className={shared.formRow}>
        <label>Card opacity (0–1)</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={form.hero_card_opacity}
          onChange={setNum('hero_card_opacity')}
          style={{ width: '200px' }}
        />
        <span style={{ marginLeft: '8px', color: '#aaa' }}>{form.hero_card_opacity}</span>
      </div>

      <div className={shared.formRow}>
        <label>Kicker</label>
        <input type="text" value={form.next_show_kicker} onChange={set('next_show_kicker')} placeholder="Next Show" />
      </div>

      <h2>Between Tours card</h2>

      <div className={shared.formRow}>
        <label>Eyebrow</label>
        <input type="text" value={form.between_tours_eyebrow} onChange={set('between_tours_eyebrow')} placeholder="BETWEEN TOURS" />
      </div>
      <div className={shared.formRow}>
        <label>Heading</label>
        <input type="text" value={form.between_tours_heading} onChange={set('between_tours_heading')} placeholder="No shows currently scheduled." />
      </div>
      <div className={shared.formRow}>
        <label>Body text</label>
        <textarea
          value={form.between_tours_body}
          onChange={set('between_tours_body')}
          rows={3}
          placeholder="We're off the road right now…"
        />
      </div>

      <h2>Social strip</h2>

      <div className={shared.formRow}>
        <label>Kicker</label>
        <input type="text" value={form.social_kicker} onChange={set('social_kicker')} placeholder="FOLLOW US" />
      </div>

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Lagrer…' : saved ? 'Lagret!' : 'Lagre'}
      </button>
    </div>
  )
}

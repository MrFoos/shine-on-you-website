import { useState } from 'react'
import shared from './AdminShared.module.css'

const EMPTY = {
  date: '',
  venue: '',
  city: '',
  country: '',
  ticket_url: '',
  ticket_status: 'available',
}

export default function EventForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY)
  const [saving, setSaving] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form className={shared.form} onSubmit={handleSubmit}>
      <div className={shared.formRow}>
        <label>Dato</label>
        <input type="date" value={form.date} onChange={set('date')} required />
      </div>
      <div className={shared.formRow}>
        <label>Venue</label>
        <input type="text" value={form.venue} onChange={set('venue')} required />
      </div>
      <div className={shared.formRow}>
        <label>By</label>
        <input type="text" value={form.city} onChange={set('city')} required />
      </div>
      <div className={shared.formRow}>
        <label>Land</label>
        <input type="text" value={form.country} onChange={set('country')} required />
      </div>
      <div className={shared.formRow}>
        <label>Billett-URL</label>
        <input type="url" value={form.ticket_url} onChange={set('ticket_url')} placeholder="https://…" />
      </div>
      <div className={shared.formRow}>
        <label>Status</label>
        <select value={form.ticket_status} onChange={set('ticket_status')}>
          <option value="available">Available</option>
          <option value="coming_soon">Coming Soon</option>
          <option value="sold_out">Sold Out</option>
        </select>
      </div>
      <div className={shared.formActions}>
        <button type="submit" disabled={saving}>{saving ? 'Lagrer…' : 'Lagre'}</button>
        <button type="button" onClick={onCancel}>Avbryt</button>
      </div>
    </form>
  )
}

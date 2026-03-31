import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import EventForm from './EventForm'

export default function EventTable() {
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null) // event object or 'new'
  const [fetchError, setFetchError] = useState(null)
  const [saveError, setSaveError] = useState(null)

  const fetch = async () => {
    const { data, error } = await supabase.from('events').select('*').order('date')
    if (error) setFetchError('Klarte ikke hente arrangementer.')
    else setEvents(data ?? [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (form) => {
    const { error } = editing === 'new'
      ? await supabase.from('events').insert([form])
      : await supabase.from('events').update(form).eq('id', editing.id)
    if (error) {
      setSaveError('Lagring feilet. Prøv igjen.')
      return
    }
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Slette dette arrangementet?')) return
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) {
      setSaveError('Sletting feilet. Prøv igjen.')
      return
    }
    fetch()
  }

  if (editing) {
    return (
      <div>
        {saveError && <p className="admin-error">{saveError}</p>}
        <EventForm
          initial={editing === 'new' ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      </div>
    )
  }

  return (
    <div>
      <button className="admin-btn-add" onClick={() => setEditing('new')}>+ Nytt arrangement</button>
      {fetchError && <p className="admin-error">{fetchError}</p>}
      {saveError && <p className="admin-error">{saveError}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Dato</th>
            <th>Venue</th>
            <th>By</th>
            <th>Land</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td>{e.date}</td>
              <td>{e.venue}</td>
              <td>{e.city}</td>
              <td>{e.country}</td>
              <td>{e.ticket_status}</td>
              <td>
                <button onClick={() => setEditing(e)}>Rediger</button>
                <button onClick={() => handleDelete(e.id)}>Slett</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

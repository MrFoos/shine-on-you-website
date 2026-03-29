import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import EventForm from './EventForm'

export default function EventTable() {
  const [events, setEvents] = useState([])
  const [editing, setEditing] = useState(null) // event object or 'new'

  const fetch = async () => {
    const { data } = await supabase.from('events').select('*').order('date')
    setEvents(data ?? [])
  }

  useEffect(() => { fetch() }, [])

  const handleSave = async (form) => {
    if (editing === 'new') {
      await supabase.from('events').insert([form])
    } else {
      await supabase.from('events').update(form).eq('id', editing.id)
    }
    setEditing(null)
    fetch()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Slette dette arrangementet?')) return
    await supabase.from('events').delete().eq('id', id)
    fetch()
  }

  if (editing) {
    return (
      <EventForm
        initial={editing === 'new' ? null : editing}
        onSave={handleSave}
        onCancel={() => setEditing(null)}
      />
    )
  }

  return (
    <div>
      <button className="admin-btn-add" onClick={() => setEditing('new')}>+ Nytt arrangement</button>
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

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import shared from './AdminShared.module.css'

const PAGE_SIZE = 50

const TABLE_OPTIONS = [
  'all', 'events', 'about', 'members', 'videos',
  'gallery', 'presskit_files', 'settings', 'contact',
  'storage:gallery', 'storage:members', 'storage:presskit',
]

const OP_STYLE = {
  INSERT:         { label: 'Lagt til',   color: '#4caf50' },
  UPDATE:         { label: 'Endret',     color: '#ff9800' },
  DELETE:         { label: 'Slettet',    color: '#f44336' },
  STORAGE_UPLOAD: { label: 'Fil lastet', color: '#2196f3' },
  STORAGE_DELETE: { label: 'Fil slettet',color: '#9c27b0' },
}

const formatDate = (iso) =>
  new Date(iso).toLocaleString('nb-NO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

export default function AuditLog() {
  const [rows, setRows]               = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [tableFilter, setTableFilter] = useState('all')
  const [page, setPage]               = useState(0)
  const [hasMore, setHasMore]         = useState(false)
  const [expanded, setExpanded]       = useState(null)

  const load = useCallback(async (filter, p) => {
    setLoading(true)
    setError(null)

    let q = supabase
      .from('audit_log')
      .select('id, created_at, user_email, table_name, operation, record_id, old_data, new_data')
      .order('created_at', { ascending: false })
      .range(p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE)

    if (filter !== 'all') q = q.eq('table_name', filter)

    const { data, error: err } = await q
    if (err) {
      setError('Klarte ikke hente endringslogg.')
    } else {
      setHasMore(data.length > PAGE_SIZE)
      setRows(data.slice(0, PAGE_SIZE))
    }
    setLoading(false)
  }, [])

  useEffect(() => { setPage(0) }, [tableFilter])
  useEffect(() => { load(tableFilter, page) }, [tableFilter, page, load])

  return (
    <div className={shared.editor}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <label style={{ fontSize: 13, color: '#aaa' }}>Tabell</label>
        <select
          value={tableFilter}
          onChange={e => setTableFilter(e.target.value)}
          style={{ padding: '6px 10px', borderRadius: 6, background: '#1e1e1e', color: '#fff', border: '1px solid #444' }}
        >
          {TABLE_OPTIONS.map(t => (
            <option key={t} value={t}>{t === 'all' ? 'Alle' : t}</option>
          ))}
        </select>
      </div>

      {error && <p className={shared.error}>{error}</p>}
      {loading && <p style={{ color: '#aaa' }}>Laster…</p>}
      {!loading && rows.length === 0 && <p style={{ color: '#aaa' }}>Ingen loggposter funnet.</p>}

      <div className={shared.fileList}>
        {rows.map(row => {
          const op = OP_STYLE[row.operation] ?? { label: row.operation, color: '#aaa' }
          const isExpanded = expanded === row.id
          const hasDiff = row.old_data || row.new_data

          return (
            <div
              key={row.id}
              className={shared.fileItem}
              style={{ flexDirection: 'column', alignItems: 'flex-start', cursor: 'default' }}
            >
              <div style={{ display: 'flex', gap: 12, width: '100%', alignItems: 'center' }}>
                <span style={{ color: '#aaa', fontSize: 12, minWidth: 150 }}>
                  {formatDate(row.created_at)}
                </span>
                <span style={{ color: op.color, fontWeight: 600, minWidth: 90, fontSize: 13 }}>
                  {op.label}
                </span>
                <span style={{ flex: 1, fontSize: 13 }}>
                  <strong>{row.table_name}</strong>
                  {row.record_id && <span style={{ color: '#aaa' }}> #{row.record_id}</span>}
                </span>
                <span style={{ fontSize: 12, color: '#aaa' }}>
                  {row.user_email ?? '—'}
                </span>
                {hasDiff && (
                  <button
                    onClick={() => setExpanded(prev => prev === row.id ? null : row.id)}
                    style={{ background: '#333', color: '#aaa', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 12 }}
                  >
                    {isExpanded ? 'Skjul' : 'Diff'}
                  </button>
                )}
              </div>

              {isExpanded && (
                <div style={{ display: 'flex', gap: 12, width: '100%', marginTop: 8 }}>
                  {row.old_data && (
                    <pre style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, padding: 10, fontSize: 11, color: '#f88', overflow: 'auto', maxHeight: 280, margin: 0 }}>
                      {JSON.stringify(row.old_data, null, 2)}
                    </pre>
                  )}
                  {row.new_data && (
                    <pre style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', borderRadius: 4, padding: 10, fontSize: 11, color: '#8f8', overflow: 'auto', maxHeight: 280, margin: 0 }}>
                      {JSON.stringify(row.new_data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
        >
          Forrige
        </button>
        <span style={{ color: '#aaa', fontSize: 13 }}>Side {page + 1}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!hasMore}
          style={{ background: '#333', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: !hasMore ? 'not-allowed' : 'pointer' }}
        >
          Neste
        </button>
      </div>
    </div>
  )
}

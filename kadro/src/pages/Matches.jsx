import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

export default function Matches() {
  const navigate = useNavigate()
  const [formations, setFormations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadFormations() }, [])

  async function loadFormations() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('formations')
      .select('*')
      .eq('user_id', user.id)
      .order('match_date', { ascending: false, nullsFirst: false })
    if (data) setFormations(data)
    setLoading(false)
  }

  async function handleDelete(id, e) {
    e.stopPropagation()
    if (!confirm('Delete this formation?')) return
    await supabase.from('formation_slots').delete().eq('formation_id', id)
    await supabase.from('formations').delete().eq('id', id)
    setFormations(prev => prev.filter(f => f.id !== id))
  }

  const filtered = formations.filter(f => {
    if (filter === 'with-date') return !!f.match_date
    if (filter === 'no-date') return !f.match_date
    return true
  })

  return (
    <div className="flex flex-col min-h-dvh pb-24">
      <Header
        title="Matches"
        showBack={false}
        right={
          <button
            onClick={() => navigate('/formation/new')}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1.5px solid rgba(34,197,94,0.25)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} className="w-4 h-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        }
      />

      {/* Filter pills — scrollable, no wrap */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2 px-4 pt-3 pb-1" style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
          {[['all', 'All'], ['with-date', 'Scheduled'], ['no-date', 'Drafts']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0"
              style={filter === key
                ? { background: '#16a34a', color: 'white' }
                : { background: 'rgba(255,255,255,0.06)', color: '#9ca3af' }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-2 flex flex-col gap-2.5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 text-sm">No formations yet</p>
            <button onClick={() => navigate('/formation/new')} className="mt-4 text-green-400 text-sm font-bold">
              + Create your first formation
            </button>
          </div>
        ) : (
          filtered.map(f => (
            <button
              key={f.id}
              onClick={() => navigate(`/formation/${f.id}`)}
              className="flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(34,197,94,0.08)',
              }}
            >
              {/* Formation type badge */}
              <div
                className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl"
                style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  minWidth: '52px',
                  height: '52px',
                  padding: '4px',
                }}
              >
                <span
                  className="font-black text-green-400 text-center leading-tight"
                  style={{ fontSize: f.formation_type.length > 5 ? '8px' : '10px' }}
                >
                  {f.formation_type}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-white truncate">
                  {f.name || 'Untitled Formation'}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {f.match_date && (
                    <span className="text-xs text-gray-500">
                      {new Date(f.match_date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  )}
                  {f.result && (
                    <span
                      className="text-xs font-bold text-white px-2 py-0.5 rounded-md"
                      style={{ background: 'rgba(34,197,94,0.2)' }}
                    >
                      {f.result}
                    </span>
                  )}
                  {!f.match_date && (
                    <span className="text-xs text-gray-700 italic">Draft</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={e => handleDelete(f.id, e)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-700">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          ))
        )}
      </div>
      <Footer />
    </div>
  )
}

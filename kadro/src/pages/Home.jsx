import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Footer from '../components/Layout/Footer'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function PitchIcon({ size = 26 }) {
  const s = 2.2
  return (
    <svg viewBox="0 0 90 110" width={size} height={Math.round(size * 110 / 90)} fill="none">
      <rect x="3" y="3" width="84" height="104" rx="1.5" stroke="#4ade80" strokeWidth={s} />
      <path d="M3,14 A11,11 0 0 0 14,3"   stroke="#4ade80" strokeWidth={s} />
      <path d="M76,3 A11,11 0 0 0 87,14"  stroke="#4ade80" strokeWidth={s} />
      <path d="M3,96 A11,11 0 0 1 14,107" stroke="#4ade80" strokeWidth={s} />
      <path d="M76,107 A11,11 0 0 1 87,96" stroke="#4ade80" strokeWidth={s} />
      <line x1="3" y1="55" x2="87" y2="55" stroke="#4ade80" strokeWidth={s} />
      <circle cx="45" cy="55" r="13" stroke="#4ade80" strokeWidth={s} />
      <circle cx="45" cy="55" r="3" fill="#4ade80" />
      <rect x="18" y="3"  width="54" height="24" stroke="#4ade80" strokeWidth={s - 0.4} />
      <rect x="18" y="83" width="54" height="24" stroke="#4ade80" strokeWidth={s - 0.4} />
    </svg>
  )
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function MatchModal({ formation, onClose, onOpen, onDelete }) {
  const home = formation.home_team_name || 'Home'
  const away = formation.away_team_name || 'Away'
  const hasResult = !!formation.result
  const [homeScore, awayScore] = hasResult ? formation.result.split('-').map(s => s.trim()) : [null, null]
  const [confirming, setConfirming] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{
          maxWidth: 400,
          background: 'linear-gradient(160deg, #0a1a0e 0%, #080f0a 100%)',
          border: '1px solid rgba(34,197,94,0.2)',
          boxShadow: '0 0 60px rgba(0,0,0,0.7), 0 0 30px rgba(34,197,94,0.08)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #16a34a, #4ade80, #16a34a)' }} />

        {/* Header row */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: 'rgba(74,222,128,0.7)' }}
          >
            {formatDate(formation.match_date)}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} style={{ width: 14, height: 14 }}>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Score card */}
        <div
          className="mx-4 mb-4 rounded-2xl px-4 py-5"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)' }}
        >
          {hasResult ? (
            /* Match with result */
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 text-right">
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Home</p>
                <p className="text-sm font-black text-white leading-tight">{home}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <span className="text-3xl font-black text-white" style={{ minWidth: 28, textAlign: 'center' }}>{homeScore}</span>
                <span className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>—</span>
                <span className="text-3xl font-black text-white" style={{ minWidth: 28, textAlign: 'center' }}>{awayScore}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Away</p>
                <p className="text-sm font-black text-white leading-tight">{away}</p>
              </div>
            </div>
          ) : (
            /* Formation only, no result */
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 text-right">
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Home</p>
                <p className="text-sm font-black text-white leading-tight">{home}</p>
              </div>
              <div className="flex flex-col items-center px-3">
                <span className="text-xs font-bold tracking-widest" style={{ color: 'rgba(255,255,255,0.32)' }}>VS</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-[11px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Away</p>
                <p className="text-sm font-black text-white leading-tight">{away}</p>
              </div>
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 px-5 mb-4">
          {formation.formation_type && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth={2} style={{ width: 12, height: 12 }}>
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="3" x2="12" y2="9" /><line x1="12" y1="15" x2="12" y2="21" />
                <line x1="2" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="22" y2="12" />
              </svg>
              <span className="text-[11px] font-bold" style={{ color: '#93c5fd' }}>{formation.formation_type}</span>
            </div>
          )}
          {formation.name && (
            <div
              className="flex items-center px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.18)' }}
            >
              <span className="text-[11px] font-bold" style={{ color: '#fde047' }}>{formation.name}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {formation.notes && (
          <div className="mx-4 mb-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.11)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Notes</p>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{formation.notes}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="px-4 pb-5 flex flex-col gap-2">
          <button
            onClick={onOpen}
            className="w-full py-4 rounded-2xl font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 0 24px rgba(34,197,94,0.25)' }}
          >
            <span>View Formation</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} style={{ width: 16, height: 16 }}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.14)', color: '#f87171' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}>
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
              </svg>
              Delete Formation
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)', color: '#9ca3af' }}
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}
              >
                Yes, Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [formations, setFormations] = useState([])
  const [selected, setSelected] = useState(null) // formation shown in modal

  useEffect(() => { loadData() }, [])

  async function handleDelete(formation) {
    await supabase.from('formation_slots').delete().eq('formation_id', formation.id)
    await supabase.from('formations').delete().eq('id', formation.id)
    setSelected(null)
    loadData()
  }

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('formations')
      .select('id, match_date, formation_type, result, name, home_team_name, away_team_name, notes')
      .eq('user_id', user.id)
    if (data) setFormations(data)
  }

  /* ── Calendar logic ──────────────────────────────── */
  const firstDay = new Date(current.year, current.month, 1).getDay()
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  const daysInPrev = new Date(current.year, current.month, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++)
    cells.push({ day: daysInPrev - firstDay + 1 + i, current: false })
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true })
  while (cells.length % 7 !== 0)
    cells.push({ day: cells.length - firstDay - daysInMonth + 1, current: false })

  const byDate = {}
  formations.forEach(f => { if (f.match_date) byDate[f.match_date] = f })

  const monthCount = Object.keys(byDate).filter(d => {
    const [y, m] = d.split('-').map(Number)
    return y === current.year && m === current.month + 1
  }).length

  function ds(day) {
    return `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function isToday(cell) {
    return cell.current &&
      cell.day === today.getDate() &&
      current.month === today.getMonth() &&
      current.year === today.getFullYear()
  }

  function isPast(dateString) {
    return new Date(dateString + 'T00:00:00') < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  function handleDay(cell) {
    if (!cell.current) return
    const d = ds(cell.day)
    const f = byDate[d]
    if (f) setSelected(f)
    else navigate(`/formation/new?date=${d}`)
  }

  function prev() {
    setCurrent(p => { const d = new Date(p.year, p.month - 1); return { year: d.getFullYear(), month: d.getMonth() } })
  }
  function next() {
    setCurrent(p => { const d = new Date(p.year, p.month + 1); return { year: d.getFullYear(), month: d.getMonth() } })
  }

  /* ── Render ──────────────────────────────────────── */
  return (
    <div
      className="relative flex flex-col min-h-dvh overflow-hidden"
      style={{ background: '#04080a' }}
    >
      {/* Stadium background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/stadium-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 25%',
            opacity: 0.58,
          }}
        />
        {/* gradient: darker at top (header), lighter in middle (calendar), dark at bottom (nav) */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(4,8,10,0.85) 0%, rgba(4,8,10,0.55) 25%, rgba(4,8,10,0.6) 75%, rgba(4,8,10,0.95) 100%)',
          }}
        />
      </div>

      {/* ── Content ─────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col flex-1 pb-28"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* ── Header ── */}
        <header
          className="flex items-center justify-between px-4 sticky top-0 z-40"
          style={{
            background: 'rgba(4,8,10,0.92)',
            borderBottom: '1px solid rgba(255,255,255,0.13)',
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            paddingBottom: '12px',
            backdropFilter: 'blur(16px)',
          }}
        >
          <PitchIcon size={24} />
          <span className="text-base font-bold tracking-widest text-white uppercase">Calendar</span>
          <div style={{ width: 24 }} />
        </header>

        {/* ── Month header ── */}
        <div className="flex items-end justify-between px-5 pt-5 pb-6">
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-1"
              style={{ color: '#4ade80', opacity: 0.75 }}
            >
              Schedule
            </p>
            <h2 className="text-4xl font-black text-white leading-none tracking-tight">
              {MONTHS[current.month]}
            </h2>
            <p className="text-sm font-medium mt-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {current.year}
              {monthCount > 0
                ? ` · ${monthCount} formation${monthCount !== 1 ? 's' : ''}`
                : ' · tap a date to plan'}
            </p>
          </div>

          {/* Prev / Next */}
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} style={{ width: 15, height: 15 }}>
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} style={{ width: 15, height: 15 }}>
                <path d="M9 18l6-6-6-6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Day-of-week labels ── */}
        <div className="grid grid-cols-7 px-4 mb-2">
          {DAYS.map((d, i) => (
            <div
              key={i}
              className="text-center"
              style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.06em' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Thin separator */}
        <div className="mx-4 mb-3" style={{ height: '1px', background: 'rgba(34,197,94,0.12)' }} />

        {/* ── Calendar grid ── */}
        <div className="grid grid-cols-7 gap-1.5 px-4">
          {cells.map((cell, idx) => {
            const dateKey = cell.current ? ds(cell.day) : null
            const formation = dateKey ? byDate[dateKey] : null
            const todayCell = isToday(cell)
            const past = dateKey ? isPast(dateKey) : false

            /* visual state */
            let bg = 'rgba(255,255,255,0.11)'
            let border = '1px solid rgba(255,255,255,0.09)'
            let numColor = 'rgba(255,255,255,0.35)'

            if (!cell.current) {
              bg = 'transparent'; border = 'none'; numColor = 'rgba(255,255,255,0.18)'
            } else if (todayCell) {
              bg = 'rgba(74,222,128,0.1)'; border = '1.5px solid rgba(74,222,128,0.55)'; numColor = '#4ade80'
            } else if (formation) {
              bg = 'rgba(34,197,94,0.1)'; border = '1px solid rgba(34,197,94,0.28)'; numColor = '#ffffff'
            }

            const accentColor = formation?.result ? '#4ade80' : '#60a5fa'

            return (
              <button
                key={idx}
                onClick={() => handleDay(cell)}
                disabled={!cell.current}
                className="relative flex flex-col items-center rounded-xl transition-all active:scale-95"
                style={{
                  paddingTop: '7px',
                  paddingBottom: '6px',
                  minHeight: '64px',
                  background: bg,
                  border,
                  opacity: !cell.current ? 0.4 : 1,
                  cursor: cell.current ? 'pointer' : 'default',
                }}
              >
                {/* Day number */}
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: todayCell || formation ? 800 : 500,
                    lineHeight: 1,
                    color: numColor,
                  }}
                >
                  {cell.day}
                </span>

                {/* Formation badge */}
                {formation && (
                  <div className="flex flex-col items-center mt-1.5 gap-0.5" style={{ width: '100%', paddingInline: 3 }}>
                    <div
                      className="w-full rounded-sm"
                      style={{ height: 2, background: accentColor, opacity: 0.85 }}
                    />
                    <span
                      style={{
                        fontSize: '7.5px', fontWeight: 700, color: accentColor,
                        lineHeight: 1.2, maxWidth: '100%', textAlign: 'center',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        paddingInline: 1,
                      }}
                    >
                      {formation.result || formation.name || formation.formation_type || '···'}
                    </span>
                    {formation.result && formation.name && (
                      <span
                        style={{
                          fontSize: '7px', fontWeight: 600, color: 'rgba(255,255,255,0.38)',
                          lineHeight: 1.2, maxWidth: '100%', textAlign: 'center',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          paddingInline: 1,
                        }}
                      >
                        {formation.name}
                      </span>
                    )}
                  </div>
                )}

                {/* Today, no formation */}
                {todayCell && !formation && (
                  <div
                    className="mt-1.5 flex items-center justify-center rounded-full"
                    style={{ width: 16, height: 16, background: 'rgba(74,222,128,0.18)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={3} style={{ width: 8, height: 8 }}>
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Legend ── */}
        <div
          className="flex items-center justify-center gap-5 mt-5 mx-4 py-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.09)' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 rounded-full" style={{ background: '#4ade80' }} />
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Result saved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 rounded-full" style={{ background: '#60a5fa' }} />
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Formation only</span>
          </div>
        </div>

        <Footer />
      </div>

      {/* ── Match modal ── */}
      {selected && (
        <MatchModal
          formation={selected}
          onClose={() => setSelected(null)}
          onOpen={() => navigate(`/formation/${selected.id}`)}
          onDelete={() => handleDelete(selected)}
        />
      )}
    </div>
  )
}

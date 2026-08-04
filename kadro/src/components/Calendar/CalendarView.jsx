import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function SoccerBallSmall() {
  return (
    <svg viewBox="0 0 20 20" fill="none" style={{ width: 14, height: 14 }}>
      <circle cx="10" cy="10" r="9" fill="#1a3a1a" stroke="rgba(74,222,128,0.6)" strokeWidth="1.2" />
      <polygon points="10,4 12.5,6.5 11.5,9.5 8.5,9.5 7.5,6.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
      <polygon points="4.5,8 7,7.5 8.5,9.5 7,12 4.5,11.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
      <polygon points="15.5,8 13,7.5 11.5,9.5 13,12 15.5,11.5" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
      <polygon points="6.5,15 7,12 10,13.5 13,12 13.5,15" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.8" />
    </svg>
  )
}

export default function CalendarView({ formations }) {
  const navigate = useNavigate()
  const today = new Date()
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const firstDay = new Date(current.year, current.month, 1).getDay()
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  const daysInPrev = new Date(current.year, current.month, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: daysInPrev - firstDay + 1 + i, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - firstDay - daysInMonth + 1, current: false })
  }

  const formationsByDate = {}
  formations?.forEach(f => {
    if (f.match_date) formationsByDate[f.match_date] = f
  })

  function dateStr(day) {
    return `${current.year}-${String(current.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function handleDayClick(cell) {
    if (!cell.current) return
    const ds = dateStr(cell.day)
    const formation = formationsByDate[ds]
    if (formation) navigate(`/formation/${formation.id}`)
    else navigate(`/formation/new?date=${ds}`)
  }

  function isToday(cell) {
    return (
      cell.current &&
      cell.day === today.getDate() &&
      current.month === today.getMonth() &&
      current.year === today.getFullYear()
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(34,197,94,0.12)',
      }}
    >
      {/* Month header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(34,197,94,0.08)' }}
      >
        <button
          onClick={() => setCurrent(prev => {
            const d = new Date(prev.year, prev.month - 1)
            return { year: d.getFullYear(), month: d.getMonth() }
          })}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
          </svg>
        </button>

        <span className="text-sm font-bold text-white tracking-wide">
          {MONTHS[current.month]} {current.year}
        </span>

        <button
          onClick={() => setCurrent(prev => {
            const d = new Date(prev.year, prev.month + 1)
            return { year: d.getFullYear(), month: d.getMonth() }
          })}
          className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 px-3 pt-2">
        {DAYS.map((d, i) => (
          <div
            key={i}
            className="flex items-center justify-center pb-1.5"
            style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
        {cells.map((cell, idx) => {
          const ds = cell.current ? dateStr(cell.day) : null
          const formation = ds ? formationsByDate[ds] : null
          const today_ = isToday(cell)
          const isPast = ds && new Date(ds) < new Date(today.toDateString())
          const isFutureEmpty = cell.current && !formation && !isPast

          return (
            <button
              key={idx}
              onClick={() => handleDayClick(cell)}
              disabled={!cell.current}
              className={`relative flex flex-col items-center justify-start pt-1.5 pb-1.5 rounded-xl transition-all ${
                cell.current ? 'active:bg-white/10' : 'opacity-20 cursor-default'
              } ${today_ ? 'ring-1 ring-green-400/60' : ''} ${
                isFutureEmpty ? 'hover:bg-green-400/5' : formation ? 'hover:bg-white/5' : ''
              }`}
              style={{ minHeight: '60px' }}
            >
              {/* Day number */}
              <span
                className="text-xs font-semibold leading-none mb-1"
                style={{
                  color: today_
                    ? '#4ade80'
                    : formation
                    ? '#ffffff'
                    : cell.current
                    ? '#9ca3af'
                    : '#374151',
                }}
              >
                {cell.day}
              </span>

              {/* Formation: soccer ball icon + text */}
              {formation && (
                <div className="flex flex-col items-center gap-0.5">
                  <SoccerBallSmall />
                  <span
                    className="text-center leading-none font-semibold truncate w-full px-0.5"
                    style={{
                      fontSize: '8px',
                      color: formation.result ? '#4ade80' : '#93c5fd',
                      maxWidth: '36px',
                    }}
                  >
                    {formation.result
                      ? formation.result
                      : formation.formation_type || ''}
                  </span>
                </div>
              )}

              {/* Future empty: dashed "+" */}
              {isFutureEmpty && !today_ && (
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    border: '1.5px dashed rgba(34,197,94,0.25)',
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.45)" strokeWidth={3} style={{ width: 8, height: 8 }}>
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </div>
              )}

              {/* Today future: green "NEW" badge */}
              {today_ && !formation && (
                <div
                  className="px-1 py-0.5 rounded"
                  style={{
                    background: 'rgba(34,197,94,0.15)',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}
                >
                  <span style={{ fontSize: '7px', color: '#4ade80', fontWeight: 700, letterSpacing: '0.05em' }}>
                    NEW
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

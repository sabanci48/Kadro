import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import FORMATIONS, { MATCH_FORMATS, FORMAT_LABELS } from '../lib/formations'
import Pitch from '../components/Pitch/Pitch'
import PlayerSlot from '../components/Pitch/PlayerSlot'
import BenchSection from '../components/Pitch/BenchSection'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

const ALL_BENCH = Array.from({ length: 7 }, (_, i) => ({ key: `SUB${i + 1}` }))

export default function ShareFormation() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const viewParam = searchParams.get('view') // 'single' | 'match' | null

  const [formation, setFormation] = useState(null)
  const [singleAssignments, setSingleAssignments] = useState({})
  const [homeAssignments, setHomeAssignments] = useState({})
  const [awayAssignments, setAwayAssignments] = useState({})
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => { loadShare() }, [id])

  async function loadShare() {
    const { data: f } = await supabase
      .from('formations')
      .select('*')
      .eq('id', id)
      .eq('is_public', true)
      .single()

    if (!f) { setNotFound(true); setLoading(false); return }
    setFormation(f)

    const { data: fslots } = await supabase
      .from('formation_slots')
      .select('*, players(*)')
      .eq('formation_id', id)

    if (fslots) {
      const single = {}, home = {}, away = {}
      const hasAwaySlots = fslots.some(s => s.team === 'away')
      fslots.forEach(s => {
        if (!s.players) return
        if (s.team === 'away') away[s.slot_key] = s.players
        else if (s.team === 'home' && hasAwaySlots) home[s.slot_key] = s.players
        else single[s.slot_key] = s.players
      })
      setSingleAssignments(single)
      setHomeAssignments(home)
      setAwayAssignments(away)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh" style={{ background: '#04080a' }}>
        <div className="w-8 h-8 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh gap-4 px-8 text-center" style={{ background: '#04080a' }}>
        <svg viewBox="0 0 90 110" width={48} height={58} fill="none">
          <rect x="3" y="3" width="84" height="104" rx="1.5" stroke="#4ade80" strokeWidth={2.2} />
          <line x1="3" y1="55" x2="87" y2="55" stroke="#4ade80" strokeWidth={2.2} />
          <circle cx="45" cy="55" r="13" stroke="#4ade80" strokeWidth={2.2} />
          <circle cx="45" cy="55" r="3" fill="#4ade80" />
        </svg>
        <p className="text-white font-black text-xl">Formation not found</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          This lineup is private or doesn't exist
        </p>
      </div>
    )
  }

  const hasAway = Object.keys(awayAssignments).length > 0
  const isMatchView = viewParam === 'match' || (!viewParam && hasAway)
  // For single view: prefer singleAssignments, fall back to homeAssignments (old data compat)
  const displayAssignments = isMatchView
    ? homeAssignments
    : (Object.keys(singleAssignments).length > 0 ? singleAssignments : homeAssignments)

  const slots = (MATCH_FORMATS[11] ?? FORMATIONS[formation.formation_type]) || []
  const awaySlots = (MATCH_FORMATS[11] ?? FORMATIONS[formation.away_formation_type || formation.formation_type]) || []
  const hasBench = ALL_BENCH.some(s => displayAssignments[s.key])
  const hasAwayBench = ALL_BENCH.some(s => awayAssignments[s.key])
  const hasResult = !!formation.result
  const [homeScore, awayScore] = hasResult ? formation.result.split('-').map(s => s.trim()) : []
  const home = formation.home_team_name || 'Home'
  const away = formation.away_team_name || 'Away'

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#04080a' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-5"
        style={{
          background: 'rgba(4,8,10,0.97)',
          borderBottom: '1px solid rgba(34,197,94,0.18)',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)',
          paddingBottom: '14px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 90 110" width={20} height={24} fill="none">
            <rect x="3" y="3" width="84" height="104" rx="1.5" stroke="#4ade80" strokeWidth={2.2} />
            <path d="M3,14 A11,11 0 0 0 14,3" stroke="#4ade80" strokeWidth={2.2} />
            <path d="M76,3 A11,11 0 0 0 87,14" stroke="#4ade80" strokeWidth={2.2} />
            <path d="M3,96 A11,11 0 0 1 14,107" stroke="#4ade80" strokeWidth={2.2} />
            <path d="M76,107 A11,11 0 0 1 87,96" stroke="#4ade80" strokeWidth={2.2} />
            <line x1="3" y1="55" x2="87" y2="55" stroke="#4ade80" strokeWidth={2.2} />
            <circle cx="45" cy="55" r="13" stroke="#4ade80" strokeWidth={2.2} />
            <circle cx="45" cy="55" r="3" fill="#4ade80" />
            <rect x="18" y="3" width="54" height="24" stroke="#4ade80" strokeWidth={1.8} />
            <rect x="18" y="83" width="54" height="24" stroke="#4ade80" strokeWidth={1.8} />
          </svg>
          <span className="text-sm font-black tracking-[0.25em] uppercase" style={{ color: '#4ade80' }}>KADRO</span>
        </div>
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Lineup Card
        </span>
      </header>

      <div className="flex-1 overflow-y-auto pb-10">
        {/* Match info */}
        <div className="px-4 pt-5 pb-2">
          {/* Date + match type */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {formation.match_date && (
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {formatDate(formation.match_date)}
              </span>
            )}
            {formation.name && (
              <div
                className="px-2.5 py-1 rounded-lg"
                style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.22)' }}
              >
                <span className="text-[10px] font-bold" style={{ color: '#fde047' }}>{formation.name}</span>
              </div>
            )}
          </div>

          {/* Score card */}
          <div
            className="rounded-2xl px-4 py-4 mb-3"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(34,197,94,0.22)',
              boxShadow: '0 0 28px rgba(34,197,94,0.07), 0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            {hasResult ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Home</p>
                  <p className="text-base font-black text-white leading-tight">{home}</p>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
                  style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
                >
                  <span className="text-2xl font-black text-white" style={{ minWidth: 24, textAlign: 'center' }}>{homeScore}</span>
                  <span className="font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>—</span>
                  <span className="text-2xl font-black text-white" style={{ minWidth: 24, textAlign: 'center' }}>{awayScore}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Away</p>
                  <p className="text-base font-black text-white leading-tight">{away}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Home</p>
                  <p className="text-base font-black text-white leading-tight">{home}</p>
                </div>
                <span className="text-sm font-bold tracking-widest px-3" style={{ color: 'rgba(255,255,255,0.35)' }}>VS</span>
                <div className="flex-1 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Away</p>
                  <p className="text-base font-black text-white leading-tight">{away}</p>
                </div>
              </div>
            )}
          </div>


          {/* Notes */}
          {formation.notes && (
            <div
              className="mt-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(34,197,94,0.18)',
                boxShadow: '0 0 20px rgba(34,197,94,0.05)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(74,222,128,0.6)' }}>Notes</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{formation.notes}</p>
            </div>
          )}
        </div>

        {/* Pitch */}
        <div className="px-3 mt-2">
          <Pitch>
            {/* Home formation badge */}
            <div className="absolute top-2 left-2">
              <div
                className="px-2 py-1 rounded-lg"
                style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(29,78,216,0.5)' }}
              >
                <span className="text-[10px] font-bold text-blue-400">
                  {FORMAT_LABELS[11] ?? formation.formation_type}
                </span>
              </div>
            </div>

            {isMatchView ? (
              <>
                {/* Away formation badge */}
                <div className="absolute bottom-2 left-2">
                  <div
                    className="px-2 py-1 rounded-lg"
                    style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(185,28,28,0.5)' }}
                  >
                    <span className="text-[10px] font-bold text-red-400">
                      {FORMAT_LABELS[11] ?? (formation.away_formation_type || formation.formation_type)}
                    </span>
                  </div>
                </div>

                {/* Home team — top half */}
                {slots.map(slot => (
                  <PlayerSlot
                    key={`h-${slot.key}`}
                    slot={{ ...slot, y: 50 - slot.y / 2 }}
                    player={displayAssignments[slot.key]}
                    onClick={() => {}}
                    color="blue"
                    small
                  />
                ))}

                {/* Away team — bottom half */}
                {awaySlots.map(slot => (
                  <PlayerSlot
                    key={`a-${slot.key}`}
                    slot={{ ...slot, y: 50 + slot.y / 2 }}
                    player={awayAssignments[slot.key]}
                    onClick={() => {}}
                    color="red"
                    small
                  />
                ))}
              </>
            ) : (
              slots.map(slot => (
                <PlayerSlot
                  key={slot.key}
                  slot={slot}
                  player={displayAssignments[slot.key]}
                  onClick={() => {}}
                  color="blue"
                />
              ))
            )}
          </Pitch>
        </div>

        {/* Benches */}
        {isMatchView ? (
          <>
            {hasBench && (
              <div style={{ borderTop: '1px solid rgba(29,78,216,0.2)', marginTop: 2 }}>
                <BenchSection
                  slots={ALL_BENCH}
                  players={displayAssignments}
                  onSlotClick={() => {}}
                  color="blue"
                  label={`${formation.home_team_name || 'Home'} Bench`}
                />
              </div>
            )}
            {hasAwayBench && (
              <div style={{ borderTop: '1px solid rgba(185,28,28,0.2)' }}>
                <BenchSection
                  slots={ALL_BENCH}
                  players={awayAssignments}
                  onSlotClick={() => {}}
                  color="red"
                  label={`${formation.away_team_name || 'Away'} Bench`}
                />
              </div>
            )}
          </>
        ) : (
          hasBench && (
            <BenchSection
              slots={ALL_BENCH}
              players={displayAssignments}
              onSlotClick={() => {}}
              color="blue"
              label="Substitutes"
            />
          )
        )}

        {/* Footer */}
        <div className="mx-4 mt-8">
          {/* CTA card */}
          <div
            className="flex items-center justify-between px-4 py-4 rounded-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.04))',
              border: '1px solid rgba(34,197,94,0.2)',
            }}
          >
            <div>
              <p className="text-sm font-black text-white">Build your own lineup</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Plan formations & track results
              </p>
            </div>
            <a
              href="https://build-kadro.netlify.app/signup"
              className="px-3 py-2 rounded-xl flex-shrink-0 no-underline"
              style={{ background: 'rgba(34,197,94,0.18)', border: '1px solid rgba(34,197,94,0.3)' }}
            >
              <span className="text-xs font-black" style={{ color: '#4ade80' }}>Try KADRO</span>
            </a>
          </div>

          {/* Copyright */}
          <div
            className="flex flex-col items-center gap-2 py-5"
            style={{ borderTop: '1px solid rgba(34,197,94,0.12)' }}
          >
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 90 110" width={16} height={20} fill="none">
                <rect x="3" y="3" width="84" height="104" rx="1.5" stroke="#4ade80" strokeWidth={3} />
                <path d="M3,14 A11,11 0 0 0 14,3" stroke="#4ade80" strokeWidth={3} />
                <path d="M76,3 A11,11 0 0 0 87,14" stroke="#4ade80" strokeWidth={3} />
                <path d="M3,96 A11,11 0 0 1 14,107" stroke="#4ade80" strokeWidth={3} />
                <path d="M76,107 A11,11 0 0 1 87,96" stroke="#4ade80" strokeWidth={3} />
                <line x1="3" y1="55" x2="87" y2="55" stroke="#4ade80" strokeWidth={3} />
                <circle cx="45" cy="55" r="13" stroke="#4ade80" strokeWidth={3} />
                <circle cx="45" cy="55" r="3" fill="#4ade80" />
              </svg>
              <span
                className="text-sm font-black tracking-[0.22em] uppercase"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                KADRO™
              </span>
            </div>
            <p className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.32)' }}>
              The Football Formation Builder
            </p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 500 }}>
              © {new Date().getFullYear()} KADRO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

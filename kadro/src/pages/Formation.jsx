import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import FORMATIONS, { FORMATION_TYPES, MATCH_FORMATS, FORMAT_BENCH_COUNT, FORMAT_LABELS } from '../lib/formations'
import Pitch from '../components/Pitch/Pitch'
import PlayerSlot from '../components/Pitch/PlayerSlot'
import BenchSection from '../components/Pitch/BenchSection'
import PlayerPickerModal from '../components/Players/PlayerPickerModal'
import PlayerStatsModal, { getPlayerOverall, getPlayerGoals } from '../components/Players/PlayerStatsModal'
import Footer from '../components/Layout/Footer'

const MATCH_TYPES = ['Friendly', 'League', 'Cup', 'Tournament', 'Training']

const JERSEY_COLORS = [
  { key: 'blue',   from: '#60a5fa', label: 'Blue' },
  { key: 'red',    from: '#f87171', label: 'Red' },
  { key: 'green',  from: '#4ade80', label: 'Green' },
  { key: 'white',  from: '#e2e8f0', label: 'White' },
  { key: 'black',  from: '#4b5563', label: 'Black' },
  { key: 'yellow', from: '#fde047', label: 'Yellow' },
  { key: 'orange', from: '#fb923c', label: 'Orange' },
  { key: 'purple', from: '#c084fc', label: 'Purple' },
  { key: 'cyan',   from: '#22d3ee', label: 'Sky' },
  { key: 'maroon', from: '#e11d48', label: 'Maroon' },
  { key: 'navy',   from: '#2563eb', label: 'Navy' },
  { key: 'pink',   from: '#f472b6', label: 'Pink' },
]

const TEAM_STYLE_MAP = {
  blue:   { bg: '#1d4ed8', border: '#60a5fa', text: '#dbeafe' },
  red:    { bg: '#991b1b', border: '#f87171', text: '#fecaca' },
  green:  { bg: '#166534', border: '#4ade80', text: '#dcfce7' },
  white:  { bg: '#475569', border: '#e2e8f0', text: '#f1f5f9' },
  black:  { bg: '#1f2937', border: '#9ca3af', text: '#f9fafb' },
  yellow: { bg: '#78350f', border: '#fde047', text: '#fef9c3' },
  orange: { bg: '#7c2d12', border: '#fb923c', text: '#ffedd5' },
  purple: { bg: '#4c1d95', border: '#c084fc', text: '#f3e8ff' },
  cyan:   { bg: '#0c4a6e', border: '#22d3ee', text: '#cffafe' },
  maroon: { bg: '#881337', border: '#f43f5e', text: '#ffe4e6' },
  navy:   { bg: '#0a1628', border: '#3b82f6', text: '#dbeafe' },
  pink:   { bg: '#831843', border: '#f472b6', text: '#fce7f3' },
}

function getTeamStyles(colorKey) {
  return TEAM_STYLE_MAP[colorKey] || TEAM_STYLE_MAP.blue
}

function loadColors(formationId) {
  try {
    const s = localStorage.getItem(`kadro_colors_${formationId}`)
    return s ? JSON.parse(s) : { home: 'blue', away: 'red' }
  } catch { return { home: 'blue', away: 'red' } }
}

function persistColors(formationId, home, away) {
  localStorage.setItem(`kadro_colors_${formationId}`, JSON.stringify({ home, away }))
}

function loadPlayerCount(formationId) {
  try {
    const s = localStorage.getItem(`kadro_pc_${formationId}`)
    return s ? parseInt(s, 10) : 11
  } catch { return 11 }
}

function persistPlayerCount(formationId, count) {
  if (formationId && formationId !== 'new') {
    localStorage.setItem(`kadro_pc_${formationId}`, String(count))
  }
}

function ColorPicker({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">{label}</label>
      <div className="grid grid-cols-6 gap-x-2 gap-y-3">
        {JERSEY_COLORS.map(c => (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            className="flex flex-col items-center gap-1"
          >
            <div
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: c.from,
                border: value === c.key ? '3px solid white' : '2px solid rgba(255,255,255,0.1)',
                boxShadow: value === c.key ? `0 0 14px ${c.from}90` : 'none',
                transform: value === c.key ? 'scale(1.18)' : 'scale(1)',
                transition: 'all 0.15s ease',
              }}
            />
            <span style={{
              fontSize: '9px', fontWeight: 700,
              color: value === c.key ? 'white' : '#6b7280',
            }}>
              {c.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

const ALL_BENCH_SLOTS = [
  { key: 'SUB1' }, { key: 'SUB2' }, { key: 'SUB3' },
  { key: 'SUB4' }, { key: 'SUB5' }, { key: 'SUB6' }, { key: 'SUB7' },
]

const TABS = ['Formation', 'Stats', 'Match Info']

export default function Formation() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const isNew = id === 'new'
  const defaultDate = searchParams.get('date') || ''

  const [tab, setTab] = useState('Formation')
  const [viewMode, setViewMode] = useState('single')
  const [formationType, setFormationType] = useState('4-3-3')
  const [formationName, setFormationName] = useState('')
  const [matchDate, setMatchDate] = useState(defaultDate)
  const [result, setResult] = useState('')
  const [homeTeamName, setHomeTeamName] = useState('Home Team')
  const [awayTeamName, setAwayTeamName] = useState('Away Team')
  const [awayFormationType, setAwayFormationType] = useState('4-3-3')
  const [notes, setNotes] = useState('')

  const [squadPlayers, setSquadPlayers] = useState([])
  const [assignments, setAssignments] = useState({})       // single view only
  const [homeAssignments, setHomeAssignments] = useState({}) // match view home team only
  const [awayAssignments, setAwayAssignments] = useState({})
  const [activeSlot, setActiveSlot] = useState(null)
  const [activeTeam, setActiveTeam] = useState('home')
  const [statsPlayer, setStatsPlayer] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [showHomePicker, setShowHomePicker] = useState(false)
  const [showAwayPicker, setShowAwayPicker] = useState(false)
  const [homeTeamColor, setHomeTeamColor] = useState('blue')
  const [awayTeamColor, setAwayTeamColor] = useState('red')
  const [isPublic, setIsPublic] = useState(false)
  const [copied, setCopied] = useState(false)
  const [playerCount, setPlayerCount] = useState(11)
  const [customPositions, setCustomPositions] = useState({})
  const [dragLive, setDragLive] = useState(null)
  const dragInfoRef = useRef(null)
  const hasDraggedRef = useRef(false)
  const pitchRef = useRef(null)
  const matchPitchRef = useRef(null)

  const slots =(MATCH_FORMATS[playerCount] ?? FORMATIONS[formationType]) || []
  const awaySlots = (MATCH_FORMATS[playerCount] ?? FORMATIONS[awayFormationType]) || []
  const benchSlots = ALL_BENCH_SLOTS.slice(0, FORMAT_BENCH_COUNT[playerCount] ?? 7)
  const activeFormationLabel = FORMAT_LABELS[playerCount] ?? formationType
  const activeAwayLabel = FORMAT_LABELS[playerCount] ?? awayFormationType

  useEffect(() => {
    loadSquad()
    if (!isNew) loadFormation()
  }, [id])

  useEffect(() => {
    if (!isNew) persistColors(id, homeTeamColor, awayTeamColor)
  }, [homeTeamColor, awayTeamColor])

  useEffect(() => {
    function onMove(e) {
      if (!dragInfoRef.current) return
      const { posKey, rect, startX, startY } = dragInfoRef.current
      const clientX = e.touches?.[0]?.clientX ?? e.clientX
      const clientY = e.touches?.[0]?.clientY ?? e.clientY
      if (!hasDraggedRef.current && Math.hypot(clientX - startX, clientY - startY) < 8) return
      hasDraggedRef.current = true
      e.preventDefault()
      const x = Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100))
      const y = Math.max(3, Math.min(97, ((clientY - rect.top) / rect.height) * 100))
      dragInfoRef.current.liveX = x
      dragInfoRef.current.liveY = y
      setDragLive({ posKey, x, y })
    }

    function onUp() {
      if (!dragInfoRef.current) return
      const { posKey, liveX, liveY } = dragInfoRef.current
      if (hasDraggedRef.current && liveX != null) {
        setCustomPositions(prev => ({ ...prev, [posKey]: { x: liveX, y: liveY } }))
      }
      dragInfoRef.current = null
      setDragLive(null)
      setTimeout(() => { hasDraggedRef.current = false }, 50)
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  async function loadSquad() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('players').select('*').eq('user_id', user.id).order('jersey_number')
    if (data) setSquadPlayers(data)
  }

  async function loadFormation() {
    setLoading(true)
    const { data: formation } = await supabase.from('formations').select('*').eq('id', id).single()
    if (!formation) { navigate('/formation/new'); return }

    setFormationName(formation.name || '')
    setFormationType(formation.formation_type || '4-3-3')
    setMatchDate(formation.match_date || '')
    setResult(formation.result || '')
    setNotes(formation.notes || '')
    setHomeTeamName(formation.home_team_name || 'Home Team')
    setAwayTeamName(formation.away_team_name || 'Away Team')
    setAwayFormationType(formation.away_formation_type || '4-3-3')
    setPlayerCount(loadPlayerCount(id))

    const colors = loadColors(id)
    setHomeTeamColor(colors.home)
    setAwayTeamColor(colors.away)
    setIsPublic(formation.is_public || false)

    const { data: fslots } = await supabase.from('formation_slots').select('*, players(*)').eq('formation_id', id)
    if (fslots) {
      const single = {}, home = {}, away = {}
      const hasAwayTeam = fslots.some(s => s.team === 'away')
      fslots.forEach(s => {
        if (s.team === 'away') away[s.slot_key] = s.players
        else if (s.team === 'home' && hasAwayTeam) home[s.slot_key] = s.players
        else single[s.slot_key] = s.players
      })
      setAssignments(single)
      setHomeAssignments(home)
      setAwayAssignments(away)
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const effectiveFormationType = FORMAT_LABELS[playerCount] ?? formationType
    const payload = {
      user_id: user.id,
      name: formationName || null,
      is_public: isPublic,
      formation_type: effectiveFormationType,
      away_formation_type: effectiveFormationType,
      match_date: matchDate || null,
      result: result || null,
      notes: notes || null,
      home_team_name: homeTeamName,
      away_team_name: awayTeamName,
    }

    let formationId = id
    if (isNew) {
      const { data } = await supabase.from('formations').insert(payload).select().single()
      formationId = data.id
    } else {
      await supabase.from('formations').update(payload).eq('id', id)
    }

    await supabase.from('formation_slots').delete().eq('formation_id', formationId)
    const slotRows = []
    Object.entries(assignments).forEach(([key, player]) => {
      if (player) slotRows.push({ formation_id: formationId, slot_key: key, player_id: player.id, team: 'single', is_substitute: key.startsWith('SUB') })
    })
    Object.entries(homeAssignments).forEach(([key, player]) => {
      if (player) slotRows.push({ formation_id: formationId, slot_key: key, player_id: player.id, team: 'home', is_substitute: key.startsWith('SUB') })
    })
    Object.entries(awayAssignments).forEach(([key, player]) => {
      if (player) slotRows.push({ formation_id: formationId, slot_key: key, player_id: player.id, team: 'away', is_substitute: key.startsWith('SUB') })
    })
    if (slotRows.length > 0) await supabase.from('formation_slots').insert(slotRows)

    setSaving(false)
    persistColors(formationId, homeTeamColor, awayTeamColor)
    persistPlayerCount(formationId, playerCount)
    navigate(`/formation/${formationId}`, { replace: true })
    if (isNew) window.location.reload()
  }

  function effectiveSlot(slot, posKey) {
    if (dragLive?.posKey === posKey) return { ...slot, x: dragLive.x, y: dragLive.y }
    if (customPositions[posKey]) return { ...slot, ...customPositions[posKey] }
    return slot
  }

  function startDrag(e, posKey, pitchEl) {
    if (!pitchEl) return
    e.stopPropagation()
    const rect = pitchEl.getBoundingClientRect()
    const clientX = e.touches?.[0]?.clientX ?? e.clientX
    const clientY = e.touches?.[0]?.clientY ?? e.clientY
    hasDraggedRef.current = false
    dragInfoRef.current = { posKey, rect, startX: clientX, startY: clientY, liveX: null, liveY: null }
  }

  function openPicker(slot, team = 'home') {
    if (hasDraggedRef.current) return
    setActiveSlot(slot)
    setActiveTeam(team)
  }

  function handlePlayerSelect(player) {
    if (activeTeam === 'away') setAwayAssignments(prev => ({ ...prev, [activeSlot.key]: player }))
    else if (viewMode === 'match') setHomeAssignments(prev => ({ ...prev, [activeSlot.key]: player }))
    else setAssignments(prev => ({ ...prev, [activeSlot.key]: player }))
    setActiveSlot(null)
  }

  function handlePlayerRemove() {
    if (activeTeam === 'away') setAwayAssignments(prev => { const n = { ...prev }; delete n[activeSlot.key]; return n })
    else if (viewMode === 'match') setHomeAssignments(prev => { const n = { ...prev }; delete n[activeSlot.key]; return n })
    else setAssignments(prev => { const n = { ...prev }; delete n[activeSlot.key]; return n })
    setActiveSlot(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  const currentAssignments = activeTeam === 'away' ? awayAssignments : viewMode === 'match' ? homeAssignments : assignments
  const hasPlayer = activeSlot && currentAssignments[activeSlot.key]

  return (
    <div className="flex flex-col min-h-dvh pb-32">
      {/* Header — matches reference: back | FORMATION / 4-3-3↓ | Save */}
      <header
        className="flex items-end justify-between px-4 sticky top-0 z-40"
        style={{
          background: 'rgba(13,13,13,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
          paddingBottom: '12px',
          backdropFilter: 'blur(16px)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors rounded-xl flex-shrink-0"
          style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Center: title */}
        <span className="text-base font-bold tracking-widest text-white uppercase">Formation</span>

        <button
          onClick={handleSave}
          disabled={saving}
          className="font-bold text-sm disabled:opacity-50 transition-all active:scale-95 flex-shrink-0"
          style={{ color: '#4ade80', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
        >
          {saving ? '…' : 'Save'}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex" style={{ borderBottom: '1px solid rgba(34,197,94,0.1)' }}>
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-3.5 font-bold tracking-wide transition-colors"
            style={{
              fontSize: '13px',
              color: tab === t ? '#4ade80' : '#6b7280',
              borderBottom: tab === t ? '2px solid #22c55e' : '2px solid transparent',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Formation tab */}
      {tab === 'Formation' && (
        <div className="flex-1 px-3 pt-3">
          {/* Toolbar */}
          <div className="flex flex-col gap-2 mb-3 px-1">
            <div className="flex items-center justify-between">
              {/* View mode toggle */}
              <div
                className="flex items-center gap-1 rounded-xl p-1"
                style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <button
                  onClick={() => setViewMode('single')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={viewMode === 'single'
                    ? { background: '#16a34a', color: 'white' }
                    : { color: '#6b7280' }}
                >
                  1 Team
                </button>
                <button
                  onClick={() => setViewMode('match')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={viewMode === 'match'
                    ? { background: '#16a34a', color: 'white' }
                    : { color: '#6b7280' }}
                >
                  2 Teams
                </button>
              </div>

              {/* Player count dropdown */}
              <select
                value={playerCount}
                onChange={e => setPlayerCount(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer"
                style={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#4ade80',
                  colorScheme: 'dark',
                }}
              >
                {[5,6,7,8,9,10,11].map(n => (
                  <option key={n} value={n} style={{ background: '#1a1a1a', color: '#4ade80' }}>
                    {n}v{n}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {viewMode === 'single' ? (
            <>
              <div className="relative" ref={pitchRef} onClick={() => setShowHomePicker(false)}>
                <Pitch>
                  {/* Formation badge with picker */}
                  <div className="absolute top-2 left-2 z-20" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => playerCount === 11 && setShowHomePicker(p => !p)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(29,78,216,0.6)' }}
                    >
                      <span className="text-[10px] font-bold text-blue-400">{activeFormationLabel}</span>
                      {playerCount === 11 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth={2.5} style={{ width: 8, height: 8 }}>
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                    {showHomePicker && playerCount === 11 && (
                      <div
                        className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden"
                        style={{ background: '#1a1a2e', border: '1px solid rgba(29,78,216,0.4)', minWidth: '110px', zIndex: 30 }}
                      >
                        {FORMATION_TYPES.map(f => (
                          <button
                            key={f}
                            onClick={() => { setFormationType(f); setShowHomePicker(false) }}
                            className="w-full text-left px-3 py-2 text-[11px] font-bold transition-colors hover:bg-blue-900/40"
                            style={{ color: f === formationType ? '#60a5fa' : '#9ca3af' }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {slots.map(slot => {
                    const posKey = `single_home_${slot.key}`
                    return (
                      <PlayerSlot
                        key={slot.key}
                        slot={effectiveSlot(slot, posKey)}
                        player={assignments[slot.key]}
                        onClick={() => openPicker(slot, 'home')}
                        onPointerDown={e => startDrag(e, posKey, pitchRef.current)}
                        isDragging={dragLive?.posKey === posKey}
                        color={homeTeamColor}
                      />
                    )
                  })}
                </Pitch>
              </div>
              <BenchSection
                slots={benchSlots}
                players={assignments}
                onSlotClick={s => openPicker(s, 'home')}
                color="blue"
              />
            </>
          ) : (
            <div>
              {/* Combined pitch — home in top half, away in bottom half */}
              <div className="relative" ref={matchPitchRef} onClick={() => { setShowHomePicker(false); setShowAwayPicker(false) }}>
                <Pitch>
                  {/* Home formation badge */}
                  <div className="absolute top-2 left-2 z-20" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { if (playerCount === 11) { setShowHomePicker(p => !p); setShowAwayPicker(false) } }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(29,78,216,0.6)' }}
                    >
                      <span className="text-[10px] font-bold text-blue-400">{activeFormationLabel}</span>
                      {playerCount === 11 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth={2.5} style={{ width: 8, height: 8 }}>
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                    {showHomePicker && playerCount === 11 && (
                      <div
                        className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden"
                        style={{ background: '#1a1a2e', border: '1px solid rgba(29,78,216,0.4)', minWidth: '110px', zIndex: 30 }}
                      >
                        {FORMATION_TYPES.map(f => (
                          <button
                            key={f}
                            onClick={() => { setFormationType(f); setShowHomePicker(false) }}
                            className="w-full text-left px-3 py-2 text-[11px] font-bold transition-colors hover:bg-blue-900/40"
                            style={{ color: f === formationType ? '#60a5fa' : '#9ca3af' }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Away formation badge */}
                  <div className="absolute bottom-2 left-2 z-20" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => { if (playerCount === 11) { setShowAwayPicker(p => !p); setShowHomePicker(false) } }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(185,28,28,0.6)' }}
                    >
                      <span className="text-[10px] font-bold text-red-400">{activeAwayLabel}</span>
                      {playerCount === 11 && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth={2.5} style={{ width: 8, height: 8 }}>
                          <path d="M6 9l6 6 6-6" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                    {showAwayPicker && playerCount === 11 && (
                      <div
                        className="absolute bottom-full left-0 mb-1 rounded-xl overflow-hidden"
                        style={{ background: '#2a1a1a', border: '1px solid rgba(185,28,28,0.4)', minWidth: '110px', zIndex: 30 }}
                      >
                        {FORMATION_TYPES.map(f => (
                          <button
                            key={f}
                            onClick={() => { setAwayFormationType(f); setShowAwayPicker(false) }}
                            className="w-full text-left px-3 py-2 text-[11px] font-bold transition-colors hover:bg-red-900/40"
                            style={{ color: f === awayFormationType ? '#f87171' : '#9ca3af' }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Home team — top half, flipped so GK is near top goal */}
                  {slots.map(slot => {
                    const posKey = `match_home_${slot.key}`
                    const baseSlot = { ...slot, y: 50 - slot.y / 2 }
                    return (
                      <PlayerSlot
                        key={`h-${slot.key}`}
                        slot={effectiveSlot(baseSlot, posKey)}
                        player={homeAssignments[slot.key]}
                        onClick={() => openPicker(slot, 'home')}
                        onPointerDown={e => startDrag(e, posKey, matchPitchRef.current)}
                        isDragging={dragLive?.posKey === posKey}
                        color={homeTeamColor}
                        small
                      />
                    )
                  })}

                  {/* Away team — bottom half (y → 50 + y/2) */}
                  {awaySlots.map(slot => {
                    const posKey = `match_away_${slot.key}`
                    const baseSlot = { ...slot, y: 50 + slot.y / 2 }
                    return (
                      <PlayerSlot
                        key={`a-${slot.key}`}
                        slot={effectiveSlot(baseSlot, posKey)}
                        player={awayAssignments[slot.key]}
                        onClick={() => openPicker(slot, 'away')}
                        onPointerDown={e => startDrag(e, posKey, matchPitchRef.current)}
                        isDragging={dragLive?.posKey === posKey}
                        color={awayTeamColor}
                        small
                      />
                    )
                  })}
                </Pitch>
              </div>

              {/* Home bench */}
              <div style={{ borderTop: '1px solid rgba(29,78,216,0.2)', marginTop: 2 }}>
                <BenchSection
                  slots={benchSlots}
                  players={homeAssignments}
                  onSlotClick={s => openPicker(s, 'home')}
                  color="blue"
                  label={`${homeTeamName} Bench`}
                />
              </div>

              {/* Away bench */}
              <div style={{ borderTop: '1px solid rgba(185,28,28,0.2)' }}>
                <BenchSection
                  slots={benchSlots}
                  players={awayAssignments}
                  onSlotClick={s => openPicker(s, 'away')}
                  color="red"
                  label={`${awayTeamName} Bench`}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats tab */}
      {tab === 'Stats' && (
        <div className="flex-1 px-4 pt-4 pb-4">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">
            Tap a player to rate their performance
          </p>
          <div className="flex flex-col gap-2">
            {[...slots, ...benchSlots].map(slot => {
              const player = (viewMode === 'match' ? homeAssignments : assignments)[slot.key] || null
              if (!player) return null
              const overall = !isNew ? getPlayerOverall(id, player.id) : null
              const goals = !isNew ? getPlayerGoals(id, player.id) : 0
              const pos = slot.key.replace(/\d/g, '')
              return (
                <button
                  key={slot.key}
                  onClick={() => setStatsPlayer(player)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: getTeamStyles(homeTeamColor).bg, border: `2px solid ${getTeamStyles(homeTeamColor).border}`, color: getTeamStyles(homeTeamColor).text }}
                  >
                    {player.jersey_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-white truncate">{player.name}</div>
                    <div className="text-xs font-bold mt-0.5" style={{ color: '#4ade80' }}>{player.position || pos}</div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {goals > 0 && (
                      <div
                        className="flex flex-col items-center px-2 py-1.5 rounded-xl"
                        style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)' }}
                      >
                        <span className="text-base font-black text-white leading-none">{goals}</span>
                        <span className="text-[8px] font-bold" style={{ color: '#facc15' }}>⚽</span>
                      </div>
                    )}
                    {overall ? (
                      <div
                        className="flex flex-col items-center px-2 py-1.5 rounded-xl"
                        style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
                      >
                        <span className="text-base font-black text-white leading-none">{overall}</span>
                        <span className="text-[8px] font-bold" style={{ color: '#4ade80' }}>OVR</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>Rate →</span>
                    )}
                  </div>
                </button>
              )
            })}

            {/* Away team players if in match mode */}
            {viewMode === 'match' && [...awaySlots, ...benchSlots].map(slot => {
              const player = awayAssignments[slot.key] || null
              if (!player) return null
              const overall = !isNew ? getPlayerOverall(id, player.id) : null
              return (
                <button
                  key={`away-${slot.key}`}
                  onClick={() => setStatsPlayer(player)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all active:scale-[0.98]"
                  style={{ background: 'rgba(185,28,28,0.06)', border: '1px solid rgba(185,28,28,0.15)' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: getTeamStyles(awayTeamColor).bg, border: `2px solid ${getTeamStyles(awayTeamColor).border}`, color: getTeamStyles(awayTeamColor).text }}
                  >
                    {player.jersey_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-white truncate">{player.name}</div>
                    <div className="text-xs font-bold mt-0.5" style={{ color: '#f87171' }}>{player.position}</div>
                  </div>
                  {overall ? (
                    <div
                      className="flex flex-col items-center px-2.5 py-1.5 rounded-xl flex-shrink-0"
                      style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}
                    >
                      <span className="text-base font-black text-white leading-none">{overall}</span>
                      <span className="text-[8px] font-bold" style={{ color: '#f87171' }}>OVR</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>Rate →</span>
                  )}
                </button>
              )
            })}
          </div>

          {isNew && (
            <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Save the formation first to enable ratings
            </p>
          )}
        </div>
      )}

      {/* Match Info tab */}
      {tab === 'Match Info' && (
        <div className="flex-1 px-4 pt-4 flex flex-col gap-5 pb-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Match Type</label>
            <input
              value={formationName}
              onChange={e => setFormationName(e.target.value)}
              placeholder="e.g. League, Friendly, Cup…"
              className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Result</label>
            <input
              value={result}
              onChange={e => setResult(e.target.value)}
              placeholder="e.g. 3-1"
              className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Match Date</label>
            <input
              type="date"
              value={matchDate}
              onChange={e => setMatchDate(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)', colorScheme: 'dark' }}
            />
          </div>

          {viewMode === 'match' && (
            <>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Home Team</label>
                <input
                  value={homeTeamName}
                  onChange={e => setHomeTeamName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)' }}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Away Team</label>
                <input
                  value={awayTeamName}
                  onChange={e => setAwayTeamName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)' }}
                />
              </div>
            </>
          )}

          {/* Jersey color pickers */}
          {viewMode === 'single' ? (
            <ColorPicker label="Team Color" value={homeTeamColor} onChange={setHomeTeamColor} />
          ) : (
            <>
              <ColorPicker label="Home Team Color" value={homeTeamColor} onChange={setHomeTeamColor} />
              <ColorPicker label="Away Team Color" value={awayTeamColor} onChange={setAwayTeamColor} />
            </>
          )}

          {/* Share */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 block">Share</label>
            <div
              className="flex items-center justify-between px-4 py-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)' }}
            >
              <div>
                <p className="text-sm font-semibold text-white">Public Link</p>
                <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>Anyone with link can view</p>
              </div>
              <button
                onClick={() => { if (!isNew) setIsPublic(p => !p) }}
                style={{
                  position: 'relative', flexShrink: 0,
                  width: 46, height: 26, borderRadius: 13,
                  background: isPublic ? '#16a34a' : 'rgba(255,255,255,0.1)',
                  opacity: isNew ? 0.4 : 1,
                  cursor: isNew ? 'not-allowed' : 'pointer',
                  border: 'none', transition: 'background 0.2s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 3,
                  left: isPublic ? 23 : 3,
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'white',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>

            {isPublic && !isNew && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/share/${id}`)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="mt-2 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{
                  background: copied ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
                  border: `1.5px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: copied ? '#4ade80' : '#9ca3af',
                }}
              >
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 14, height: 14 }}>
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}>
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Share Link
                  </>
                )}
              </button>
            )}

            {isNew && (
              <p className="text-xs text-center mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Save the formation first to enable sharing
              </p>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Tactical notes, match summary…"
              className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none resize-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
      )}

      <Footer />

      {/* Player picker modal */}
      {statsPlayer && (
        <PlayerStatsModal
          player={statsPlayer}
          formationId={id}
          onClose={() => setStatsPlayer(null)}
        />
      )}

      {activeSlot && (
        <PlayerPickerModal
          slot={activeSlot}
          players={squadPlayers}
          onSelect={handlePlayerSelect}
          onRemove={hasPlayer ? handlePlayerRemove : null}
          onClose={() => setActiveSlot(null)}
          onPlayerAdded={player =>
            setSquadPlayers(prev =>
              [...prev, player].sort((a, b) => (a.jersey_number ?? 99) - (b.jersey_number ?? 99))
            )
          }
        />
      )}
    </div>
  )
}

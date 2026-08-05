import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { POSITION_LABELS } from '../../lib/formations'
import BottomSheet from '../Layout/BottomSheet'

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST']

const POSITION_GROUPS = {
  Goalkeepers: ['GK'],
  Defenders:   ['CB', 'LB', 'RB', 'LWB', 'RWB'],
  Midfielders: ['CDM', 'CM', 'CAM', 'LM', 'RM'],
  Forwards:    ['LW', 'RW', 'ST'],
}

function groupPlayers(players) {
  const groups = {}
  Object.entries(POSITION_GROUPS).forEach(([group, positions]) => {
    const list = players.filter(p => positions.includes(p.position))
    if (list.length > 0) groups[group] = list
  })
  const ungrouped = players.filter(p => !Object.values(POSITION_GROUPS).flat().includes(p.position))
  if (ungrouped.length > 0) groups['Other'] = ungrouped
  return groups
}

export default function PlayerPickerModal({ slot, players, onSelect, onRemove, onClose, onPlayerAdded }) {
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newPosition, setNewPosition] = useState('CM')
  const [saving, setSaving] = useState(false)

  const label = POSITION_LABELS[slot?.key] || slot?.key?.replace(/\d/g, '') || ''

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    String(p.jersey_number).includes(search)
  )
  const groups = groupPlayers(filtered)

  async function handleAdd() {
    if (!newName.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { data: player } = await supabase
      .from('players')
      .insert({
        user_id: user.id,
        name: newName.trim(),
        jersey_number: newNumber ? Number(newNumber) : null,
        position: newPosition,
      })
      .select()
      .single()
    setSaving(false)
    if (player) {
      onPlayerAdded?.(player)
      onSelect(player)
    }
  }

  /* ── ADD PLAYER FORM ─────────────────────────────────── */
  if (adding) {
    return (
      <BottomSheet onClose={onClose}>
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setAdding(false)}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} style={{ width: 14, height: 14 }}>
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
              </svg>
            </button>
            <h2 className="text-base font-bold text-white">Add New Player</h2>
          </div>

          <div className="mb-3">
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(74,222,128,0.6)' }}>
              Full Name
            </label>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] placeholder-gray-600 outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(34,197,94,0.2)' }}
            />
          </div>

          <div className="mb-3">
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(74,222,128,0.6)' }}>
              Jersey Number
            </label>
            <input
              type="number"
              value={newNumber}
              onChange={e => setNewNumber(e.target.value)}
              placeholder="e.g. 10"
              min={1}
              max={99}
              className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] placeholder-gray-600 outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(34,197,94,0.2)' }}
            />
          </div>

          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(74,222,128,0.6)' }}>
              Position
            </label>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map(pos => (
                <button
                  key={pos}
                  onClick={() => setNewPosition(pos)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={newPosition === pos
                    ? { background: '#16a34a', color: 'white', border: '1.5px solid #22c55e' }
                    : { background: 'rgba(255,255,255,0.07)', color: '#9ca3af', border: '1.5px solid rgba(255,255,255,0.13)' }
                  }
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 pt-2 pb-5">
          <button
            onClick={handleAdd}
            disabled={!newName.trim() || saving}
            className="w-full py-4 rounded-xl font-bold text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 0 24px rgba(34,197,94,0.2)' }}
          >
            {saving ? 'Saving…' : 'Save & Select'}
          </button>
        </div>
      </BottomSheet>
    )
  }

  /* ── PLAYER PICKER ───────────────────────────────────── */
  return (
    <BottomSheet onClose={onClose}>
      <div className="px-5 pt-4 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">
            Select Player{label ? <> — <span style={{ color: '#4ade80' }}>{label}</span></> : ''}
          </h2>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-xs font-bold text-red-400 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              Remove
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
               className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2"
               style={{ color: 'rgba(74,222,128,0.5)' }}>
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or number…"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl text-white text-[15px] placeholder-gray-600 outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(34,197,94,0.18)' }}
          />
        </div>

        {/* Player list */}
        <div className="overflow-y-auto" style={{ maxHeight: '42vh' }}>
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>No players found</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Add one below</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Object.entries(groups).map(([group, list]) => (
                <div key={group}>
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: 'rgba(74,222,128,0.55)' }}
                    >
                      {group}
                    </span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(34,197,94,0.15)' }} />
                    <span className="text-[10px] font-semibold" style={{ color: 'rgba(255,255,255,0.2)' }}>{list.length}</span>
                  </div>

                  {/* Players in category */}
                  <div className="flex flex-col gap-1.5">
                    {list.map(player => (
                      <button
                        key={player.id}
                        onClick={() => onSelect(player)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all active:scale-[0.98]"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background: '#1d4ed8', border: '2px solid #60a5fa', color: '#dbeafe' }}
                        >
                          {player.jersey_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold text-white truncate">{player.name}</div>
                          <div className="text-xs font-bold mt-0.5" style={{ color: 'rgba(74,222,128,0.7)' }}>{player.position}</div>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                             className="w-4 h-4 flex-shrink-0"
                             style={{ color: 'rgba(255,255,255,0.2)' }}>
                          <path d="M9 18l6-6-6-6" strokeLinecap="round" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add player button */}
      <div className="px-5 pt-3 pb-5">
        <button
          onClick={() => { setAdding(true); setSearch('') }}
          className="w-full py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: 'rgba(34,197,94,0.07)',
            border: '1.5px dashed rgba(34,197,94,0.3)',
            color: '#4ade80',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} style={{ width: 16, height: 16 }}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Add New Player
        </button>
      </div>
    </BottomSheet>
  )
}

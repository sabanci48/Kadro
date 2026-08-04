import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { POSITION_LABELS } from '../../lib/formations'
import BottomSheet from '../Layout/BottomSheet'

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'LWB', 'RWB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST']

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

  async function handleAdd() {
    if (!newName.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    const { data: player, error } = await supabase
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
        <div className="px-5 pt-1 pb-2">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setAdding(false)}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} style={{ width: 14, height: 14 }}>
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
              </svg>
            </button>
            <h2 className="text-base font-bold text-white">Add New Player</h2>
          </div>

          {/* Name */}
          <div className="mb-3">
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6b7280' }}>
              Full Name
            </label>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] placeholder-gray-600 outline-none"
              style={{ background: '#1a1a1a', border: '1.5px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Jersey Number */}
          <div className="mb-3">
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6b7280' }}>
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
              style={{ background: '#1a1a1a', border: '1.5px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          {/* Position */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#6b7280' }}>
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
                    : { background: 'rgba(255,255,255,0.05)', color: '#9ca3af', border: '1.5px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save button */}
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
      <div className="px-5 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">
            Select Player — <span className="text-green-400">{label}</span>
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
        <div className="relative mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
               className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or number…"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl text-white text-[15px] placeholder-gray-600 outline-none"
            style={{ background: '#1f2937', border: '1.5px solid rgba(255,255,255,0.08)' }}
          />
        </div>

        {/* Player list */}
        <div className="overflow-y-auto" style={{ maxHeight: '38vh' }}>
          {filtered.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No players found</p>
              <p className="text-gray-700 text-xs mt-1">Add one below</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map(player => (
                <button
                  key={player.id}
                  onClick={() => onSelect(player)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors hover:bg-white/5 active:bg-white/10"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ background: '#1d4ed8', border: '2px solid #60a5fa', color: '#dbeafe' }}
                  >
                    {player.jersey_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-white">{player.name}</div>
                    <div className="text-xs text-green-400 font-medium mt-0.5">{player.position}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add player button — always visible at bottom */}
      <div className="px-5 pt-2 pb-5">
        <button
          onClick={() => { setAdding(true); setSearch('') }}
          className="w-full py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1.5px dashed rgba(34,197,94,0.35)',
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

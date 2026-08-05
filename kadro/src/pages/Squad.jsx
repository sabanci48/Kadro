import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Layout/Header'
import BottomSheet from '../components/Layout/BottomSheet'
import Footer from '../components/Layout/Footer'
import { useTranslation } from '../i18n/LanguageContext'

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST']

const POSITION_GROUPS = {
  goalkeepers: ['GK'],
  defenders:   ['CB', 'LB', 'RB'],
  midfielders: ['CDM', 'CM', 'CAM', 'LM', 'RM'],
  forwards:    ['LW', 'RW', 'ST'],
}

function groupPlayers(players) {
  const groups = {}
  Object.entries(POSITION_GROUPS).forEach(([group, positions]) => {
    const list = players.filter(p => positions.includes(p.position))
    if (list.length > 0) groups[group] = list
  })
  return groups
}

export default function Squad() {
  const { t } = useTranslation()
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editPlayer, setEditPlayer] = useState(null)
  const [form, setForm] = useState({ name: '', jersey_number: '', position: 'ST' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { loadPlayers() }, [])

  async function loadPlayers() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('players').select('*').eq('user_id', user.id).order('jersey_number')
    if (data) setPlayers(data)
    setLoading(false)
  }

  function openAdd() {
    setEditPlayer(null)
    setForm({ name: '', jersey_number: '', position: 'ST' })
    setShowForm(true)
  }

  function openEdit(player) {
    setEditPlayer(player)
    setForm({ name: player.name, jersey_number: String(player.jersey_number), position: player.position })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.jersey_number) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const payload = {
      name: form.name.trim(),
      jersey_number: parseInt(form.jersey_number),
      position: form.position,
      user_id: user.id,
    }
    if (editPlayer) await supabase.from('players').update(payload).eq('id', editPlayer.id)
    else await supabase.from('players').insert(payload)
    setSaving(false)
    setShowForm(false)
    loadPlayers()
  }

  async function handleDelete(player) {
    if (!confirm(`${t('confirm_remove')} ${player.name}?`)) return
    await supabase.from('players').delete().eq('id', player.id)
    setPlayers(prev => prev.filter(p => p.id !== player.id))
  }

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    String(p.jersey_number).includes(search)
  )
  const groups = groupPlayers(filtered)

  const inputStyle = {
    background: '#252f3d',
    border: '1.5px solid rgba(255,255,255,0.15)',
  }

  return (
    <div className="flex flex-col min-h-dvh pb-24">
      <Header
        title={t('squad')}
        showBack={false}
        right={
          <button
            onClick={openAdd}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1.5px solid rgba(34,197,94,0.25)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} className="w-4 h-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        }
      />

      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
               className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('search_players')}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-[15px] placeholder-gray-600 outline-none"
            style={{ background: 'rgba(255,255,255,0.09)', border: '1.5px solid rgba(255,255,255,0.13)' }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2 px-1">{players.length} {t('players_in_squad')}</p>
      </div>

      <div className="px-4 flex flex-col gap-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">⚽</div>
            <p className="text-gray-500 text-sm">{t('no_players_yet')}</p>
            <button onClick={openAdd} className="mt-4 text-green-400 text-sm font-bold">
              {t('add_first_player')}
            </button>
          </div>
        ) : (
          Object.entries(groups).map(([group, list]) => (
            <div key={group}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{t(group)}</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.09)' }} />
                <span className="text-[10px] text-gray-700 font-semibold">{list.length}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {list.map(player => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.11)' }}
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
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(player)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.09)' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(player)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.09)' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Footer />

      {showForm && (
        <BottomSheet onClose={() => setShowForm(false)}>
          <div className="px-5 pt-4 pb-2 flex flex-col gap-3">
            <h3 className="text-base font-bold text-white">
              {editPlayer ? t('edit_player') : t('add_player')}
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">{t('full_name')}</label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder={t('name_placeholder')}
                className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none"
                style={inputStyle}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">{t('jersey_number')}</label>
                <input
                  type="number" min="1" max="99"
                  value={form.jersey_number}
                  onChange={e => setForm(p => ({ ...p, jersey_number: e.target.value }))}
                  placeholder="10"
                  className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none"
                  style={inputStyle}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">{t('position')}</label>
                <select
                  value={form.position}
                  onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-xl text-white text-[15px] outline-none appearance-none"
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                >
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="px-5 pt-2 pb-5 flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 py-4 rounded-xl font-bold text-sm text-gray-400"
              style={{ background: 'rgba(255,255,255,0.09)' }}
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!form.name || !form.jersey_number || saving}
              className="flex-1 py-4 rounded-xl font-bold text-sm text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
            >
              {saving ? '…' : t('save')}
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

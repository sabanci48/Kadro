import { useState, useEffect } from 'react'
import BottomSheet from '../Layout/BottomSheet'
import { useTranslation } from '../../i18n/LanguageContext'

const DEFAULT_CATEGORIES = ['Pass', 'Shoot', 'Team Play', 'Physical', 'Goal', 'Assist', 'Card']

function loadCategories() {
  try {
    const s = localStorage.getItem('kadro_stat_categories')
    return s ? JSON.parse(s) : DEFAULT_CATEGORIES
  } catch { return DEFAULT_CATEGORIES }
}

function persistCategories(cats) {
  localStorage.setItem('kadro_stat_categories', JSON.stringify(cats))
}

function loadRatings(formationId, playerId) {
  try {
    const s = localStorage.getItem(`kadro_ratings_${formationId}_${playerId}`)
    return s ? JSON.parse(s) : {}
  } catch { return {} }
}

function persistRatings(formationId, playerId, ratings) {
  localStorage.setItem(`kadro_ratings_${formationId}_${playerId}`, JSON.stringify(ratings))
}

const GOAL_KEY = 'goal'
const isGoalCat = cat => cat.toLowerCase() === GOAL_KEY

function RatingRow({ label, value = 0, onChange }) {
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
      <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'rgba(255,255,255,0.7)', minWidth: 88 }}>
        {label}
      </span>
      <div className="flex items-center gap-[5px] flex-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            onClick={() => onChange(n === value ? 0 : n)}
            className="transition-all active:scale-90 flex-shrink-0"
            style={{
              width: 20, height: 20,
              borderRadius: '50%',
              background: n <= value
                ? n <= 4 ? '#f87171' : n <= 7 ? '#facc15' : '#4ade80'
                : 'rgba(255,255,255,0.13)',
              border: n <= value ? 'none' : '1px solid rgba(255,255,255,0.18)',
            }}
          />
        ))}
      </div>
      <span
        className="text-sm font-black flex-shrink-0"
        style={{ minWidth: 22, textAlign: 'right', color: value ? '#4ade80' : 'rgba(255,255,255,0.32)' }}
      >
        {value || '—'}
      </span>
    </div>
  )
}

function GoalCounter({ label, value = 0, onChange }) {
  return (
    <div className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.09)' }}>
      <span className="text-sm font-semibold flex-shrink-0" style={{ color: 'rgba(255,255,255,0.7)', minWidth: 88 }}>
        {label}
      </span>
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.18)' }}
        >
          −
        </button>
        <span className="text-2xl font-black text-white" style={{ minWidth: 36, textAlign: 'center' }}>
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black transition-all active:scale-90"
          style={{ background: 'rgba(250,204,21,0.15)', color: '#facc15', border: '1px solid rgba(250,204,21,0.3)' }}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function PlayerStatsModal({ player, formationId, onClose }) {
  const { t } = useTranslation()
  const [categories, setCategories] = useState(loadCategories)
  const [ratings, setRatings] = useState(() => loadRatings(formationId, player.id))
  const [managing, setManaging] = useState(false)
  const [newCat, setNewCat] = useState('')

  useEffect(() => {
    persistRatings(formationId, player.id, ratings)
  }, [ratings])

  function setRating(cat, val) {
    setRatings(prev => ({ ...prev, [cat]: val }))
  }

  function addCategory() {
    const trimmed = newCat.trim()
    if (!trimmed || categories.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) return
    const updated = [...categories, trimmed]
    setCategories(updated)
    persistCategories(updated)
    setNewCat('')
  }

  function removeCategory(cat) {
    const updated = categories.filter(c => c !== cat)
    setCategories(updated)
    persistCategories(updated)
    setRatings(prev => { const n = { ...prev }; delete n[cat]; return n })
  }

  const ratedValues = categories
    .filter(c => !isGoalCat(c))
    .map(c => ratings[c])
    .filter(v => v != null && v > 0)
  const overall = ratedValues.length > 0
    ? (ratedValues.reduce((a, b) => a + b, 0) / ratedValues.length).toFixed(1)
    : null
  const goalValue = ratings['Goal'] ?? ratings['goal'] ?? 0

  if (managing) {
    return (
      <BottomSheet onClose={onClose}>
        <div className="px-5 pt-4 pb-2">
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setManaging(false)}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all active:scale-90"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} style={{ width: 14, height: 14 }}>
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" />
              </svg>
            </button>
            <h2 className="text-base font-bold text-white">{t('manage_categories')}</h2>
          </div>

          <div className="flex flex-col mb-4" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
            {categories.map(cat => (
              <div
                key={cat}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.11)' }}
              >
                <span className="text-sm font-semibold text-white">{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  {t('remove')}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-2">
            <input
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
              placeholder={t('new_category_placeholder')}
              className="flex-1 px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(34,197,94,0.2)' }}
            />
            <button
              onClick={addCategory}
              disabled={!newCat.trim()}
              className="px-4 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-40"
              style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1.5px solid rgba(34,197,94,0.3)' }}
            >
              {t('add')}
            </button>
          </div>
        </div>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet onClose={onClose}>
      <div className="px-5 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-base flex-shrink-0"
            style={{ background: '#1d4ed8', border: '2px solid #60a5fa', color: '#dbeafe' }}
          >
            {player.jersey_number ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-black text-white leading-tight">{player.name}</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: '#4ade80' }}>{player.position}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {goalValue > 0 && (
              <div
                className="flex flex-col items-center px-2.5 py-2 rounded-xl"
                style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.25)' }}
              >
                <span className="text-xl font-black text-white leading-none">{goalValue}</span>
                <span className="text-[9px] font-bold mt-0.5" style={{ color: '#facc15' }}>⚽</span>
              </div>
            )}
            {overall && (
              <div
                className="flex flex-col items-center px-2.5 py-2 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
              >
                <span className="text-xl font-black text-white leading-none">{overall}</span>
                <span className="text-[9px] font-bold mt-0.5" style={{ color: '#4ade80' }}>OVR</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-3" style={{ maxHeight: '42vh', overflowY: 'auto' }}>
          {categories.map(cat =>
            isGoalCat(cat) ? (
              <GoalCounter
                key={cat}
                label={t('goal_label')}
                value={ratings[cat] || 0}
                onChange={val => setRating(cat, val)}
              />
            ) : (
              <RatingRow
                key={cat}
                label={cat}
                value={ratings[cat] || 0}
                onChange={val => setRating(cat, val)}
              />
            )
          )}
        </div>
      </div>

      <div className="px-5 pt-2 pb-5">
        <button
          onClick={() => setManaging(true)}
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)', color: '#9ca3af' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          {t('manage_categories')}
        </button>
      </div>
    </BottomSheet>
  )
}

export function getPlayerOverall(formationId, playerId) {
  try {
    const s = localStorage.getItem(`kadro_ratings_${formationId}_${playerId}`)
    if (!s) return null
    const ratings = JSON.parse(s)
    const vals = Object.entries(ratings)
      .filter(([k, v]) => !isGoalCat(k) && v > 0)
      .map(([, v]) => v)
    if (vals.length === 0) return null
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  } catch { return null }
}

export function getPlayerGoals(formationId, playerId) {
  try {
    const s = localStorage.getItem(`kadro_ratings_${formationId}_${playerId}`)
    if (!s) return 0
    const ratings = JSON.parse(s)
    return ratings['Goal'] ?? ratings['goal'] ?? 0
  } catch { return 0 }
}

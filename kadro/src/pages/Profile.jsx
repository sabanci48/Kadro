import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ formations: 0, players: 0 })

  useEffect(() => { loadUser() }, [])

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      const [{ count: fCount }, { count: pCount }] = await Promise.all([
        supabase.from('formations').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('players').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      setStats({ formations: fCount || 0, players: pCount || 0 })
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="flex flex-col min-h-dvh pb-24">
      <Header title="Profile" showBack={false} />

      <div className="px-4 pt-8 flex flex-col gap-6">
        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              boxShadow: '0 0 50px rgba(34,197,94,0.3)',
            }}
          >
            {initials}
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">
              {user?.user_metadata?.full_name || 'Player'}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">{user?.email}</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: stats.formations, label: 'Formations' },
            { value: stats.players, label: 'Players' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center py-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(34,197,94,0.1)',
              }}
            >
              <div className="text-4xl font-black text-white">{value}</div>
              <div className="text-xs text-gray-500 mt-1.5 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        {/* Menu links */}
        <div className="flex flex-col gap-2">
          {[
            { label: 'Manage Squad', emoji: '👥', action: () => navigate('/squad') },
            { label: 'My Formations', emoji: '📋', action: () => navigate('/matches') },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[14px] font-semibold text-white flex-1">{item.label}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-600">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-xl font-bold text-sm tracking-wide text-red-400 transition-all active:scale-95"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1.5px solid rgba(239,68,68,0.18)',
          }}
        >
          Sign Out
        </button>

        <Footer />
      </div>
    </div>
  )
}

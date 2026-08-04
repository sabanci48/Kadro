import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Footer from '../components/Layout/Footer'

function PitchLogo({ size = 88 }) {
  const h = Math.round(size * 110 / 90)
  const sw = 2.2
  const green = '#4ade80'
  return (
    <svg viewBox="0 0 90 110" width={size} height={h} fill="none" style={{ filter: 'drop-shadow(0 0 18px rgba(74,222,128,0.5))' }}>
      {/* Outer border */}
      <rect x="3" y="3" width="84" height="104" rx="1.5" stroke={green} strokeWidth={sw} />

      {/* Corner arcs (inside corners, like corner flags) */}
      <path d="M3,14 A11,11 0 0 0 14,3" stroke={green} strokeWidth={sw} />
      <path d="M76,3 A11,11 0 0 0 87,14" stroke={green} strokeWidth={sw} />
      <path d="M3,96 A11,11 0 0 1 14,107" stroke={green} strokeWidth={sw} />
      <path d="M76,107 A11,11 0 0 1 87,96" stroke={green} strokeWidth={sw} />

      {/* Center line */}
      <line x1="3" y1="55" x2="87" y2="55" stroke={green} strokeWidth={sw} />

      {/* Center circle */}
      <circle cx="45" cy="55" r="13" stroke={green} strokeWidth={sw} />
      {/* Center dot */}
      <circle cx="45" cy="55" r="2.8" fill={green} />

      {/* === TOP HALF (attack = top) === */}
      {/* Penalty box */}
      <rect x="18" y="3" width="54" height="26" stroke={green} strokeWidth={sw} />
      {/* Goal box */}
      <rect x="30" y="3" width="30" height="12" stroke={green} strokeWidth={sw} />
      {/* Penalty spot */}
      <circle cx="45" cy="21" r="2.2" fill={green} />
      {/* Penalty arc */}
      <path d="M26,29 A20,20 0 0 1 64,29" stroke={green} strokeWidth={sw} />

      {/* === BOTTOM HALF (defense = bottom) === */}
      {/* Penalty box */}
      <rect x="18" y="81" width="54" height="26" stroke={green} strokeWidth={sw} />
      {/* Goal box */}
      <rect x="30" y="95" width="30" height="12" stroke={green} strokeWidth={sw} />
      {/* Penalty spot */}
      <circle cx="45" cy="89" r="2.2" fill={green} />
      {/* Penalty arc */}
      <path d="M26,81 A20,20 0 0 0 64,81" stroke={green} strokeWidth={sw} />

      {/* === PLAYER DOTS (4-3-3 top half) === */}
      {/* ST */}
      <circle cx="45" cy="38" r="3.5" fill={green} />
      {/* LW / RW */}
      <circle cx="14" cy="44" r="3.5" fill={green} />
      <circle cx="76" cy="44" r="3.5" fill={green} />
      {/* CMs */}
      <circle cx="27" cy="48" r="3.5" fill={green} />
      <circle cx="63" cy="48" r="3.5" fill={green} />
      {/* Defenders */}
      <circle cx="16" cy="67" r="3.5" fill={green} />
      <circle cx="36" cy="70" r="3.5" fill={green} />
      <circle cx="54" cy="70" r="3.5" fill={green} />
      <circle cx="74" cy="67" r="3.5" fill={green} />
      {/* GK */}
      <circle cx="45" cy="78" r="3.5" fill={green} />
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else navigate('/formation/new')
    setLoading(false)
  }

  return (
    <div
      className="relative flex flex-col min-h-dvh overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Stadium background photo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/stadium-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      />
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.92) 100%)' }}
      />
      {/* Green glow at top */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="mb-5">
            <PitchLogo size={88} />
          </div>
          <h1
            className="text-5xl font-black text-white"
            style={{ letterSpacing: '0.25em', textShadow: '0 0 40px rgba(74,222,128,0.35)' }}
          >
            KADRO
          </h1>
          <p className="text-sm mt-2 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>Build Your Squad</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-4 rounded-xl text-white placeholder-gray-700 text-[15px]"
              style={{ background: 'rgba(10,10,10,0.85)', border: '1.5px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-4 rounded-xl text-white placeholder-gray-700 text-[15px]"
              style={{ background: 'rgba(10,10,10,0.85)', border: '1.5px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
            />
          </div>

          {error && (
            <div
              className="text-red-400 text-sm text-center px-4 py-3 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-[15px] tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 mt-2"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              boxShadow: '0 0 30px rgba(74,222,128,0.25)',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-8">
          No account?{' '}
          <Link to="/signup" className="text-green-400 font-bold hover:text-green-300 transition-colors">
            Create one
          </Link>
        </p>
        <Footer />
      </div>
    </div>
  )
}

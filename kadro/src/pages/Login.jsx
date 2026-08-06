import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Footer from '../components/Layout/Footer'
import { useTranslation } from '../i18n/LanguageContext'

function PitchLogo({ size = 88 }) {
  const h = Math.round(size * 110 / 90)
  const sw = 2.2
  const green = '#4ade80'
  return (
    <svg viewBox="0 0 90 110" width={size} height={h} fill="none" style={{ filter: 'drop-shadow(0 0 18px rgba(74,222,128,0.5))' }}>
      <rect x="3" y="3" width="84" height="104" rx="1.5" stroke={green} strokeWidth={sw} />
      <path d="M3,14 A11,11 0 0 0 14,3" stroke={green} strokeWidth={sw} />
      <path d="M76,3 A11,11 0 0 0 87,14" stroke={green} strokeWidth={sw} />
      <path d="M3,96 A11,11 0 0 1 14,107" stroke={green} strokeWidth={sw} />
      <path d="M76,107 A11,11 0 0 1 87,96" stroke={green} strokeWidth={sw} />
      <line x1="3" y1="55" x2="87" y2="55" stroke={green} strokeWidth={sw} />
      <circle cx="45" cy="55" r="13" stroke={green} strokeWidth={sw} />
      <circle cx="45" cy="55" r="2.8" fill={green} />
      <rect x="18" y="3" width="54" height="26" stroke={green} strokeWidth={sw} />
      <rect x="30" y="3" width="30" height="12" stroke={green} strokeWidth={sw} />
      <circle cx="45" cy="21" r="2.2" fill={green} />
      <path d="M26,29 A20,20 0 0 1 64,29" stroke={green} strokeWidth={sw} />
      <rect x="18" y="81" width="54" height="26" stroke={green} strokeWidth={sw} />
      <rect x="30" y="95" width="30" height="12" stroke={green} strokeWidth={sw} />
      <circle cx="45" cy="89" r="2.2" fill={green} />
      <path d="M26,81 A20,20 0 0 0 64,81" stroke={green} strokeWidth={sw} />
      <circle cx="45" cy="38" r="3.5" fill={green} />
      <circle cx="14" cy="44" r="3.5" fill={green} />
      <circle cx="76" cy="44" r="3.5" fill={green} />
      <circle cx="27" cy="48" r="3.5" fill={green} />
      <circle cx="63" cy="48" r="3.5" fill={green} />
      <circle cx="16" cy="67" r="3.5" fill={green} />
      <circle cx="36" cy="70" r="3.5" fill={green} />
      <circle cx="54" cy="70" r="3.5" fill={green} />
      <circle cx="74" cy="67" r="3.5" fill={green} />
      <circle cx="45" cy="78" r="3.5" fill={green} />
    </svg>
  )
}

function LangToggle() {
  const { lang, setLang } = useTranslation()
  return (
    <div
      className="flex items-center rounded-lg overflow-hidden absolute top-4 right-4"
      style={{ border: '1px solid rgba(255,255,255,0.13)', zIndex: 50 }}
    >
      {['TR', 'EN'].map(l => (
        <button
          key={l}
          onClick={() => setLang(l.toLowerCase())}
          className="px-2.5 py-1 text-[10px] font-bold transition-all"
          style={{
            background: lang === l.toLowerCase() ? 'rgba(34,197,94,0.18)' : 'transparent',
            color: lang === l.toLowerCase() ? '#4ade80' : '#6b7280',
          }}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
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
      <LangToggle />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/stadium-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.88) 100%)' }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center px-6" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="flex flex-col items-center mb-10">
          <div className="mb-5"><PitchLogo size={88} /></div>

          <div className="flex items-center gap-3">
            <h1
              className="text-5xl font-black text-white"
              style={{ letterSpacing: '0.25em', textShadow: '0 0 40px rgba(74,222,128,0.35)' }}
            >
              KADRO
            </h1>

            {/* Waving flag */}
            <div style={{ position: 'relative', width: 18, height: 58, flexShrink: 0 }}>
              {/* Pole */}
              <div style={{
                position: 'absolute', left: 7, top: 0,
                width: 2, height: 58,
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.2))',
                borderRadius: 1,
              }} />
              {/* Finial */}
              <div style={{
                position: 'absolute', left: 4, top: -4,
                width: 8, height: 8, borderRadius: '50%',
                background: 'white',
                boxShadow: '0 0 6px rgba(255,255,255,0.6)',
              }} />
              {/* Flag */}
              <div
                className="wave-flag"
                style={{
                  position: 'absolute', top: 3, left: 9,
                  width: 46, height: 32,
                  background: 'white',
                  borderRadius: '0 5px 5px 0',
                  boxShadow: '2px 3px 14px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                  padding: 3,
                }}
              >
                <img src="/uafc-logo.png" alt="Union Anatolia FC" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            </div>
          </div>

          <p className="text-sm mt-2 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>{t('build_your_squad')}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('email')}</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="you@example.com"
              className="w-full px-4 py-4 rounded-xl text-white placeholder-gray-700 text-[15px]"
              style={{ background: 'rgba(10,10,10,0.85)', border: '1.5px solid rgba(255,255,255,0.20)', backdropFilter: 'blur(8px)' }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{t('password')}</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              className="w-full px-4 py-4 rounded-xl text-white placeholder-gray-700 text-[15px]"
              style={{ background: 'rgba(10,10,10,0.85)', border: '1.5px solid rgba(255,255,255,0.20)', backdropFilter: 'blur(8px)' }}
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
            type="submit" disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-[15px] tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 mt-2"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 0 30px rgba(74,222,128,0.25)' }}
          >
            {loading ? t('signing_in') : t('sign_in')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          {t('no_account')}{' '}
          <Link to="/signup" className="text-green-400 font-bold hover:text-green-300 transition-colors">
            {t('create_one')}
          </Link>
        </p>
        <Footer />
      </div>
    </div>
  )
}

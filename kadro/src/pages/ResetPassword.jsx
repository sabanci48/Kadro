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

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 7 11 7a20.3 20.3 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError(t('passwords_no_match'))
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div
        className="flex flex-col min-h-dvh items-center justify-center px-6"
        style={{ background: '#0d0d0d', paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <LangToggle />
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.3)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} className="w-8 h-8">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('password_updated_title')}</h2>
          <p className="text-gray-500 text-sm mb-6">{t('password_updated_desc')}</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 rounded-xl font-bold text-sm tracking-widest uppercase transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 0 30px rgba(74,222,128,0.25)' }}
          >
            {t('continue')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-col min-h-dvh"
      style={{
        background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <LangToggle />

      <div
        className="absolute pointer-events-none"
        style={{
          top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="flex-1 flex flex-col justify-center px-6" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="flex flex-col items-center mb-10">
          <div className="mb-5"><PitchLogo size={88} /></div>
          <h1
            className="text-5xl font-black text-white"
            style={{ letterSpacing: '0.25em', textShadow: '0 0 40px rgba(74,222,128,0.35)' }}
          >
            KADRO
          </h1>
          <p className="text-sm mt-2 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('set_new_password')}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: t('new_password'), value: password, onChange: setPassword, placeholder: t('new_password_placeholder'), show: showPassword, setShow: setShowPassword },
            { label: t('confirm_password'), value: confirmPassword, onChange: setConfirmPassword, placeholder: t('confirm_password_placeholder'), show: showConfirmPassword, setShow: setShowConfirmPassword },
          ].map(({ label, value, onChange, placeholder, show, setShow }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={value}
                  onChange={e => onChange(e.target.value)}
                  placeholder={placeholder}
                  minLength={6}
                  required
                  className="w-full px-4 py-4 pr-12 rounded-xl text-white placeholder-gray-700 text-[15px]"
                  style={{ background: '#242424', border: '1.5px solid rgba(255,255,255,0.15)' }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                  tabIndex={-1}
                >
                  <EyeIcon open={show} />
                </button>
              </div>
            </div>
          ))}

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
            {loading ? t('updating') : t('update_password')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-8">
          <Link to="/login" className="text-green-400 font-bold hover:text-green-300">{t('back_to_login')}</Link>
        </p>
        <Footer />
      </div>
    </div>
  )
}

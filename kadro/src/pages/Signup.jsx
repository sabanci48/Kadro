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
      style={{ border: '1px solid rgba(255,255,255,0.13)', zIndex: 10 }}
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

export default function Signup() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: 'https://build-kadro.netlify.app/login',
      },
    })
    if (error) setError(error.message)
    else setSuccess(true)
    setLoading(false)
  }

  async function handleResend() {
    setResending(true)
    await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: 'https://build-kadro.netlify.app/login' } })
    setResending(false)
    setResent(true)
    setTimeout(() => setResent(false), 4000)
  }

  if (success) {
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
          <h2 className="text-xl font-bold text-white mb-2">{t('check_your_email')}</h2>
          <p className="text-gray-500 text-sm mb-6">
            {t('confirmation_sent')}<br />
            <span className="text-green-400 font-semibold">{email}</span>
          </p>
          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="text-sm text-gray-500 mb-4 disabled:opacity-50"
          >
            {resent ? t('email_resent') : resending ? t('sending') : t('didnt_receive')}
          </button>
          <br />
          <Link to="/login" className="text-green-400 font-bold text-sm">{t('back_to_login')}</Link>
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
          <p className="text-sm mt-2 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('create_your_account')}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: t('full_name'), type: 'text', value: name, onChange: setName, placeholder: t('name_placeholder') },
            { label: t('email'), type: 'email', value: email, onChange: setEmail, placeholder: 'you@example.com' },
            { label: t('password'), type: 'password', value: password, onChange: setPassword, placeholder: t('password_placeholder'), minLength: 6 },
          ].map(({ label, ...props }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">{label}</label>
              <input
                {...props}
                onChange={e => props.onChange(e.target.value)}
                required
                className="w-full px-4 py-4 rounded-xl text-white placeholder-gray-700 text-[15px]"
                style={{ background: '#242424', border: '1.5px solid rgba(255,255,255,0.15)' }}
              />
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
            {loading ? t('creating') : t('create_account')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-8">
          {t('already_have_account')}{' '}
          <Link to="/login" className="text-green-400 font-bold hover:text-green-300">{t('sign_in')}</Link>
        </p>
        <Footer />
      </div>
    </div>
  )
}

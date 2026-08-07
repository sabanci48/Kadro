import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { useTranslation } from '../i18n/LanguageContext'

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

export default function Profile() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ formations: 0, players: 0 })

  const [name, setName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameMsg, setNameMsg] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')

  useEffect(() => { loadUser() }, [])

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setName(user?.user_metadata?.full_name || '')
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

  async function handleSaveName() {
    setNameMsg('')
    setSavingName(true)
    const { data, error } = await supabase.auth.updateUser({ data: { full_name: name } })
    if (!error) {
      setUser(data.user)
      setNameMsg(t('name_updated'))
      setTimeout(() => setNameMsg(''), 3000)
    }
    setSavingName(false)
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPasswordError('')
    if (newPassword !== confirmNewPassword) {
      setPasswordError(t('passwords_no_match'))
      return
    }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPasswordError(error.message)
    } else {
      setNewPassword('')
      setConfirmNewPassword('')
      setPasswordMsg(t('password_updated'))
      setTimeout(() => setPasswordMsg(''), 3000)
    }
    setSavingPassword(false)
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="flex flex-col min-h-dvh pb-24">
      <Header title={t('profile')} showBack={false} />

      <div className="px-4 pt-8 flex flex-col gap-6">
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
              {user?.user_metadata?.full_name || t('player_default')}
            </div>
            <div className="text-sm text-gray-500 mt-0.5">{user?.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { value: stats.formations, labelKey: 'formations' },
            { value: stats.players, labelKey: 'players' },
          ].map(({ value, labelKey }) => (
            <div
              key={labelKey}
              className="flex flex-col items-center py-6 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(34,197,94,0.1)',
              }}
            >
              <div className="text-4xl font-black text-white">{value}</div>
              <div className="text-xs text-gray-500 mt-1.5 uppercase tracking-wider">{t(labelKey)}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {[
            { labelKey: 'manage_squad', emoji: '👥', action: () => navigate('/squad') },
            { labelKey: 'my_formations', emoji: '📋', action: () => navigate('/matches') },
          ].map(item => (
            <button
              key={item.labelKey}
              onClick={item.action}
              className="flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all active:scale-[0.98]"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.11)',
              }}
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-[14px] font-semibold text-white flex-1">{t(item.labelKey)}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-600">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          ))}
        </div>

        <div
          className="flex flex-col gap-4 p-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.11)' }}
        >
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('account_settings')}</div>

          <div className="flex flex-col gap-2">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">{t('full_name')}</label>
            <div className="flex gap-2">
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl text-white placeholder-gray-700 text-[14px]"
                style={{ background: '#242424', border: '1.5px solid rgba(255,255,255,0.15)' }}
              />
              <button
                onClick={handleSaveName}
                disabled={savingName || !name.trim()}
                className="px-5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                {t('save')}
              </button>
            </div>
            {nameMsg && <div className="text-green-400 text-xs">{nameMsg}</div>}
          </div>

          <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">{t('change_password')}</div>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-2">
              {[
                { label: t('new_password'), value: newPassword, onChange: setNewPassword, show: showNewPassword, setShow: setShowNewPassword },
                { label: t('confirm_password'), value: confirmNewPassword, onChange: setConfirmNewPassword, show: showConfirmNewPassword, setShow: setShowConfirmNewPassword },
              ].map(({ label, value, onChange, show, setShow }) => (
                <div key={label} className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={label}
                    minLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-xl text-white placeholder-gray-700 text-[14px]"
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
              ))}
              {passwordError && <div className="text-red-400 text-xs">{passwordError}</div>}
              {passwordMsg && <div className="text-green-400 text-xs">{passwordMsg}</div>}
              <button
                type="submit"
                disabled={savingPassword || !newPassword || !confirmNewPassword}
                className="py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
              >
                {savingPassword ? t('updating') : t('update_password')}
              </button>
            </form>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-xl font-bold text-sm tracking-wide text-red-400 transition-all active:scale-95"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1.5px solid rgba(239,68,68,0.18)',
          }}
        >
          {t('sign_out')}
        </button>

        <Footer />
      </div>
    </div>
  )
}

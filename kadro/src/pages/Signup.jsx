import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import SoccerBall from '../components/icons/SoccerBall'
import Footer from '../components/Layout/Footer'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) setError(error.message)
    else setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div
        className="flex flex-col min-h-dvh items-center justify-center px-6"
        style={{ background: '#0d0d0d', paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(74,222,128,0.1)', border: '2px solid rgba(74,222,128,0.3)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={2.5} className="w-8 h-8">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm mb-6">
            Confirmation link sent to<br />
            <span className="text-green-400 font-semibold">{email}</span>
          </p>
          <Link to="/login" className="text-green-400 font-bold text-sm">← Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col min-h-dvh"
      style={{
        background: 'linear-gradient(180deg, #050505 0%, #0d0d0d 100%)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="flex-1 flex flex-col justify-center px-6" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="flex flex-col items-center mb-10">
          <div
            className="flex items-center justify-center mb-5"
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              boxShadow: '0 0 50px rgba(74,222,128,0.3)',
            }}
          >
            <SoccerBall size={56} />
          </div>
          <h1
            className="text-5xl font-black text-white"
            style={{ letterSpacing: '0.25em', textShadow: '0 0 40px rgba(74,222,128,0.35)' }}
          >
            KADRO
          </h1>
          <p className="text-gray-600 text-sm mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Full Name', type: 'text', value: name, onChange: setName, placeholder: 'Your name' },
            { label: 'Email', type: 'email', value: email, onChange: setEmail, placeholder: 'you@example.com' },
            { label: 'Password', type: 'password', value: password, onChange: setPassword, placeholder: 'Min. 6 characters', minLength: 6 },
          ].map(({ label, ...props }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">{label}</label>
              <input
                {...props}
                onChange={e => props.onChange(e.target.value)}
                required
                className="w-full px-4 py-4 rounded-xl text-white placeholder-gray-700 text-[15px]"
                style={{ background: '#1a1a1a', border: '1.5px solid rgba(255,255,255,0.08)' }}
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
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-[15px] tracking-widest uppercase transition-all active:scale-95 disabled:opacity-50 mt-2"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 0 30px rgba(74,222,128,0.25)' }}
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-700 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-green-400 font-bold hover:text-green-300">Sign In</Link>
        </p>
        <Footer />
      </div>
    </div>
  )
}

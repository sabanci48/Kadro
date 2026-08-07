import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import BottomNav from './components/Layout/BottomNav'
import Home from './pages/Home'
import Formation from './pages/Formation'
import Squad from './pages/Squad'
import Matches from './pages/Matches'
import Profile from './pages/Profile'
import Payments from './pages/Payments'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ShareFormation from './pages/ShareFormation'

function AppLayout({ children }) {
  const location = useLocation()
  const hideNav = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname) || location.pathname.startsWith('/share/')
  return (
    <>
      {children}
      {!hideNav && <BottomNav />}
    </>
  )
}

function ProtectedRoute({ session, children }) {
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-dvh" style={{ background: '#0a1a0a' }}>
        <div className="w-8 h-8 rounded-full border-2 border-green-400 border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/signup" element={session ? <Navigate to="/" replace /> : <Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<ProtectedRoute session={session}><Home /></ProtectedRoute>} />
          <Route path="/formation/:id" element={<ProtectedRoute session={session}><Formation /></ProtectedRoute>} />
          <Route path="/formation" element={<Navigate to="/formation/new" replace />} />
          <Route path="/squad" element={<ProtectedRoute session={session}><Squad /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute session={session}><Matches /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute session={session}><Profile /></ProtectedRoute>} />
          <Route path="/payments" element={<ProtectedRoute session={session}><Payments /></ProtectedRoute>} />
          <Route path="/share/:id" element={<ShareFormation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

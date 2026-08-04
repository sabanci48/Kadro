import { NavLink } from 'react-router-dom'

const tabs = [
  {
    to: '/',
    label: 'Calendar',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" />
        <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" />
        <line x1="3" y1="10" x2="21" y2="10" />
        {active && <rect x="8" y="14" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />}
      </svg>
    ),
  },
  {
    to: '/squad',
    label: 'Squad',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-5 h-5">
        <circle cx="9" cy="7" r="3" />
        <circle cx="17" cy="7" r="2" />
        <path d="M3 20c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6" />
        <path d="M19 12c2 0 3 1.3 3 3" />
      </svg>
    ),
  },
  {
    to: '/formation/new',
    label: 'Formation',
    center: true,
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <circle cx="12" cy="12" r="3" fill={active ? 'white' : 'none'} />
        <line x1="12" y1="3" x2="12" y2="9" />
        <line x1="12" y1="15" x2="12" y2="21" />
        <line x1="2" y1="12" x2="9" y2="12" />
        <line x1="15" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    to: '/matches',
    label: 'Matches',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-5 h-5">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} className="w-5 h-5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

export default function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-50"
      style={{ maxWidth: '430px' }}
    >
      <div
        className="flex items-end justify-around px-1"
        style={{
          background: 'rgba(10,10,10,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: '8px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          backdropFilter: 'blur(16px)',
        }}
      >
        {tabs.map(({ to, label, icon, center }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex-1 flex flex-col items-center gap-1"
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-1 min-h-[44px] justify-center w-full">
                {center ? (
                  /* Formation center tab — floating button style */
                  <div
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #16a34a, #15803d)'
                          : 'rgba(34,197,94,0.12)',
                        border: `1.5px solid ${isActive ? '#22c55e' : 'rgba(34,197,94,0.25)'}`,
                        boxShadow: isActive ? '0 0 20px rgba(34,197,94,0.35)' : 'none',
                        color: isActive ? 'white' : '#4ade80',
                      }}
                    >
                      {icon(isActive)}
                    </div>
                    <span
                      className="text-[10px] font-semibold leading-none"
                      style={{ color: isActive ? '#4ade80' : '#6b7280' }}
                    >
                      {label}
                    </span>
                  </div>
                ) : (
                  /* Regular tab */
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="transition-colors"
                      style={{ color: isActive ? '#4ade80' : '#6b7280' }}
                    >
                      {icon(isActive)}
                    </div>
                    <span
                      className="text-[10px] font-semibold leading-none"
                      style={{ color: isActive ? '#4ade80' : '#6b7280' }}
                    >
                      {label}
                    </span>
                    {/* Active dot */}
                    {isActive && (
                      <div className="w-1 h-1 rounded-full bg-green-400" />
                    )}
                  </div>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

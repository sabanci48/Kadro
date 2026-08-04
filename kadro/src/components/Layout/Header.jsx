import { useNavigate } from 'react-router-dom'

export default function Header({ title, showBack = true, right }) {
  const navigate = useNavigate()

  return (
    <header
      className="flex items-end justify-between px-4 sticky top-0 z-40"
      style={{
        background: 'rgba(13,13,13,0.97)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: '12px',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex-1 flex items-center">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors rounded-xl"
            style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <h1 className="text-[15px] font-bold tracking-widest text-white uppercase">{title}</h1>

      <div className="flex-1 flex items-center justify-end">
        {right}
      </div>
    </header>
  )
}

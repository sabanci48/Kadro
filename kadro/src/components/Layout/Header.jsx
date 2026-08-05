import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../i18n/LanguageContext'

function LangToggle() {
  const { lang, setLang } = useTranslation()
  return (
    <div
      className="flex items-center rounded-lg overflow-hidden flex-shrink-0"
      style={{ border: '1px solid rgba(255,255,255,0.13)' }}
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

export default function Header({ title, showBack = true, right }) {
  const navigate = useNavigate()

  return (
    <header
      className="flex items-end justify-between px-4 sticky top-0 z-40"
      style={{
        background: 'rgba(13,13,13,0.97)',
        borderBottom: '1px solid rgba(255,255,255,0.13)',
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

      <div className="flex-1 flex items-center justify-end gap-2">
        <LangToggle />
        {right}
      </div>
    </header>
  )
}

export default function Footer() {
  return (
    <div className="flex flex-col items-center gap-3 py-4 mx-4 mt-2"
      style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}
    >
      {/* KADRO branding */}
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 90 110" width={13} height={16} fill="none">
          <rect x="3" y="3" width="84" height="104" rx="1.5" stroke="#4ade80" strokeWidth={4} />
          <line x1="3" y1="55" x2="87" y2="55" stroke="#4ade80" strokeWidth={4} />
          <circle cx="45" cy="55" r="13" stroke="#4ade80" strokeWidth={4} />
          <circle cx="45" cy="55" r="3" fill="#4ade80" />
        </svg>
        <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
          KADRO™
        </span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>·</span>
        <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
          © {new Date().getFullYear()} All rights reserved.
        </span>
      </div>

      {/* Sponsor + Instagram */}
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Powered by Union Anatolia FC
        </span>
        <a
          href="https://www.instagram.com/unionanatolia/?utm_source=ig_web_button_share_sheet"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(131,58,180,0.18), rgba(193,53,132,0.18), rgba(253,168,25,0.18))',
            border: '1px solid rgba(193,53,132,0.3)',
            textDecoration: 'none',
          }}
        >
          {/* Instagram icon */}
          <svg viewBox="0 0 24 24" width={11} height={11} fill="none">
            <defs>
              <linearGradient id="ig" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#f9a825" />
                <stop offset="50%" stopColor="#c13584" />
                <stop offset="100%" stopColor="#833ab4" />
              </linearGradient>
            </defs>
            <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="url(#ig)" strokeWidth="2" />
            <circle cx="12" cy="12" r="4.5" stroke="url(#ig)" strokeWidth="2" />
            <circle cx="17.5" cy="6.5" r="1" fill="url(#ig)" />
          </svg>
          <span className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Follow
          </span>
        </a>
      </div>
    </div>
  )
}

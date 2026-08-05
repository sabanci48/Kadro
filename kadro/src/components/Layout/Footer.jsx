export default function Footer() {
  return (
    <div
      className="flex items-center justify-center gap-2 py-4 mx-4 mt-2"
      style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}
    >
      <svg viewBox="0 0 90 110" width={13} height={16} fill="none">
        <rect x="3" y="3" width="84" height="104" rx="1.5" stroke="#4ade80" strokeWidth={4} />
        <line x1="3" y1="55" x2="87" y2="55" stroke="#4ade80" strokeWidth={4} />
        <circle cx="45" cy="55" r="13" stroke="#4ade80" strokeWidth={4} />
        <circle cx="45" cy="55" r="3" fill="#4ade80" />
      </svg>
      <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.22)' }}>
        KADRO™
      </span>
      <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: 12 }}>·</span>
      <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.14)' }}>
        © {new Date().getFullYear()} All rights reserved.
      </span>
    </div>
  )
}

export default function Pitch({ children, compact = false }) {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: compact ? '7/10' : '2/3',
        borderRadius: '12px',
      }}
    >
      {/* Grass — alternating light/dark stripes */}
      <div
        className="absolute inset-0"
        style={{
          background: 'repeating-linear-gradient(180deg, #2d7a2d 0px, #2d7a2d 18px, #267026 18px, #267026 36px)',
        }}
      />

      {/* Inner shadow / vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.5) 100%)',
          zIndex: 1,
        }}
      />

      {/* Pitch markings */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 200 290"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.4"
        style={{ zIndex: 2 }}
      >
        {/* Border */}
        <rect x="8" y="8" width="184" height="274" />
        {/* Halfway */}
        <line x1="8" y1="145" x2="192" y2="145" />
        {/* Centre circle */}
        <circle cx="100" cy="145" r="28" />
        <circle cx="100" cy="145" r="2.5" fill="rgba(255,255,255,0.55)" stroke="none" />
        {/* Penalty area top */}
        <rect x="54" y="8" width="92" height="46" />
        {/* Goal area top */}
        <rect x="74" y="8" width="52" height="18" />
        {/* Penalty spot top */}
        <circle cx="100" cy="40" r="2" fill="rgba(255,255,255,0.55)" stroke="none" />
        {/* Arc top */}
        <path d="M 72 54 A 28 28 0 0 1 128 54" />
        {/* Penalty area bottom */}
        <rect x="54" y="236" width="92" height="46" />
        {/* Goal area bottom */}
        <rect x="74" y="264" width="52" height="18" />
        {/* Penalty spot bottom */}
        <circle cx="100" cy="250" r="2" fill="rgba(255,255,255,0.55)" stroke="none" />
        {/* Arc bottom */}
        <path d="M 72 236 A 28 28 0 0 0 128 236" />
        {/* Goal top */}
        <rect x="82" y="2" width="36" height="8" strokeWidth="2" />
        {/* Goal bottom */}
        <rect x="82" y="280" width="36" height="8" strokeWidth="2" />
      </svg>

      {/* Player slots */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        {children}
      </div>
    </div>
  )
}

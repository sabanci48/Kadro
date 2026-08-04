// Clean soccer ball SVG used on Login, Signup and anywhere else
export default function SoccerBall({ size = 64, className = '' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      {/* Outer circle */}
      <circle cx="50" cy="50" r="47" fill="white" fillOpacity="0.08" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

      {/* Pentagon patches — classic soccer ball pattern */}
      {/* Top center pentagon */}
      <polygon points="50,8 60,20 56,34 44,34 40,20" fill="white" fillOpacity="0.85" />
      {/* Top-left pentagon */}
      <polygon points="14,32 26,22 40,30 36,44 20,44" fill="white" fillOpacity="0.85" />
      {/* Top-right pentagon */}
      <polygon points="86,32 74,22 60,30 64,44 80,44" fill="white" fillOpacity="0.85" />
      {/* Bottom-left pentagon */}
      <polygon points="16,68 28,56 42,62 40,78 24,80" fill="white" fillOpacity="0.85" />
      {/* Bottom-right pentagon */}
      <polygon points="84,68 72,56 58,62 60,78 76,80" fill="white" fillOpacity="0.85" />
      {/* Bottom center pentagon */}
      <polygon points="50,92 38,78 44,64 56,64 62,78" fill="white" fillOpacity="0.85" />

      {/* Clip everything to circle */}
      <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </svg>
  )
}

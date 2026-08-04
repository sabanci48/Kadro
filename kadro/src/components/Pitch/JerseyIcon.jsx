export default function JerseyIcon({ number, isGK = false, size = 44, color = 'blue' }) {
  const id = `j-${number}-${color}-${isGK ? 'gk' : 'f'}`

  const gradients = {
    blue:   { from: '#60a5fa', to: '#2563eb', text: 'white' },
    red:    { from: '#f87171', to: '#dc2626', text: 'white' },
    green:  { from: '#4ade80', to: '#16a34a', text: 'white' },
    white:  { from: '#f1f5f9', to: '#94a3b8', text: '#1f2937' },
    black:  { from: '#6b7280', to: '#111827', text: 'white' },
    yellow: { from: '#fde047', to: '#b45309', text: '#1f2937' },
    orange: { from: '#fb923c', to: '#c2410c', text: 'white' },
    purple: { from: '#c084fc', to: '#7c3aed', text: 'white' },
    cyan:   { from: '#22d3ee', to: '#0891b2', text: 'white' },
    maroon: { from: '#e11d48', to: '#881337', text: 'white' },
    navy:   { from: '#2563eb', to: '#0a1628', text: 'white' },
    pink:   { from: '#f472b6', to: '#be185d', text: 'white' },
  }

  const jerseyGrad = isGK
    ? { from: '#facc15', to: '#ca8a04', text: '#1f2937' }
    : (gradients[color] || gradients.blue)

  const fontSize = size > 36 ? Math.round(size * 0.38) : Math.round(size * 0.4)

  return (
    <svg
      viewBox="0 0 44 50"
      width={size}
      height={Math.round(size * 50 / 44)}
      style={{ display: 'block', filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.8))' }}
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor={jerseyGrad.from} />
          <stop offset="100%" stopColor={jerseyGrad.to} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      {/* Jersey body */}
      <path
        d="M15,3 Q22,9 29,3 L41,9 L39,19 L33,16 L33,46 L11,46 L11,16 L5,19 L3,9 Z"
        fill={`url(#${id}-grad)`}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="0.8"
      />

      {/* Shine overlay */}
      <path
        d="M15,3 Q22,9 29,3 L41,9 L39,19 L33,16 L33,26 L11,26 L11,16 L5,19 L3,9 Z"
        fill={`url(#${id}-shine)`}
      />

      {/* Collar */}
      <path
        d="M16,4 Q22,9.5 28,4"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Jersey number */}
      <text
        x="22"
        y="33"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={jerseyGrad.text || 'white'}
        fontSize={fontSize}
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        style={{ letterSpacing: '-0.5px' }}
      >
        {number ?? ''}
      </text>
    </svg>
  )
}

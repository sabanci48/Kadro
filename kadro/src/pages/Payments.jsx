import Header from '../components/Layout/Header'

export default function Payments() {
  return (
    <div className="flex flex-col min-h-dvh pb-24">
      <Header title="Payments" showBack={false} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
             style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth={1.5} className="w-8 h-8">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="6" y1="15" x2="8" y2="15" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Payments</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Premium features coming soon.<br />Stay tuned for updates!
        </p>
      </div>
    </div>
  )
}

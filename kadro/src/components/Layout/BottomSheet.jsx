export default function BottomSheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/72" onClick={onClose} />
      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: '400px',
          maxHeight: '90dvh',
          background: 'linear-gradient(160deg, #0a1a0e 0%, #080f0a 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(34,197,94,0.2)',
          boxShadow: '0 0 60px rgba(0,0,0,0.7), 0 0 30px rgba(34,197,94,0.08)',
        }}
      >
        <div style={{ height: 3, background: 'linear-gradient(90deg, #16a34a, #4ade80, #16a34a)', flexShrink: 0 }} />
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90dvh - 3px)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

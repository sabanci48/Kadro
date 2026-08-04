export default function BottomSheet({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className="relative w-full overflow-y-auto"
        style={{
          maxWidth: '400px',
          maxHeight: '90dvh',
          background: '#111827',
          borderRadius: '20px',
          border: '1px solid rgba(34,197,94,0.15)',
        }}
      >
        {/* Close handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-700" />
        </div>
        {children}
      </div>
    </div>
  )
}

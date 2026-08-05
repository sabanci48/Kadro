import { POSITION_LABELS } from '../../lib/formations'
import JerseyIcon from './JerseyIcon'

export default function PlayerSlot({ slot, player, onClick, onPointerDown, color = 'blue', small = false, isDragging = false }) {
  const slotKey = slot.key.replace(/\d/g, '')
  const isGK = (POSITION_LABELS[slot.key] || slotKey) === 'GK'

  const jerseySize = small
    ? Math.max(24, Math.min(Math.round(window.innerWidth * 0.075), 34))
    : Math.max(32, Math.min(Math.round(window.innerWidth * 0.095), 46))

  const nameSize = small ? '8px' : '10px'
  const pillPad  = small ? '1px 4px' : '2px 6px'

  return (
    <button
      onClick={onClick}
      onPointerDown={onPointerDown}
      className="absolute flex flex-col items-center group"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: 'translate(-50%, -50%)',
        gap: '3px',
        touchAction: 'none',
        zIndex: isDragging ? 50 : 1,
      }}
    >
      {player ? (
        <>
          <div className="transition-transform group-active:scale-90">
            <JerseyIcon
              number={player.jersey_number}
              isGK={isGK}
              size={jerseySize}
              color={color}
            />
          </div>

          {/* Name pill */}
          <div
            className="flex items-center justify-center rounded-md"
            style={{
              background: 'rgba(0,0,0,0.65)',
              padding: pillPad,
              minWidth: small ? '32px' : '42px',
              maxWidth: small ? '44px' : '56px',
            }}
          >
            <span
              className="font-bold text-white text-center leading-tight truncate w-full"
              style={{ fontSize: nameSize }}
            >
              {player.name.split(' ')[0].toUpperCase()}
            </span>
          </div>
        </>
      ) : (
        <>
          <div
            className="rounded-lg flex items-center justify-center transition-transform group-active:scale-90"
            style={{
              width: jerseySize,
              height: Math.round(jerseySize * 50 / 44),
              border: '1.5px dashed rgba(255,255,255,0.32)',
              background: 'rgba(0,0,0,0.25)',
            }}
          >
            <span style={{ fontSize: `${jerseySize * 0.4}px`, color: 'rgba(255,255,255,0.45)' }}>+</span>
          </div>
        </>
      )}
    </button>
  )
}

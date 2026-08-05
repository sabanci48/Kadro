import JerseyIcon from './JerseyIcon'
import { useTranslation } from '../../i18n/LanguageContext'

export default function BenchSection({ slots, players, onSlotClick, color = 'blue', label }) {
  const { t } = useTranslation()
  const filled = slots.filter(s => players[s.key])
  const empty  = slots.filter(s => !players[s.key])

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-white tracking-widest uppercase">{label ?? t('substitutes')}</span>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}
        >
          {filled.length}/{slots.length}
        </span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {slots.map((slot) => {
          const player = players[slot.key]
          return (
            <button
              key={slot.key}
              onClick={() => onSlotClick(slot)}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all group active:scale-95"
              style={{
                background: player ? '#242424' : 'transparent',
                border: player
                  ? '1px solid rgba(255,255,255,0.15)'
                  : '1.5px dashed rgba(255,255,255,0.22)',
                width: '68px',
                minHeight: '90px',
              }}
            >
              {player ? (
                <>
                  <JerseyIcon number={player.jersey_number} isGK={false} size={36} color={color} />
                  <span
                    className="text-white font-bold text-center truncate w-full"
                    style={{ fontSize: '9px' }}
                  >
                    {player.name.split(' ')[0].toUpperCase()}
                  </span>
                  <span style={{ fontSize: '8px', color: '#6b7280' }}>{player.position}</span>
                </>
              ) : (
                <>
                  <div className="flex-1 flex items-center justify-center">
                    <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>+</span>
                  </div>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)' }}>{t('add')}</span>
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

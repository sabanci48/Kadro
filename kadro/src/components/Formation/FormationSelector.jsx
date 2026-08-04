import { FORMATION_TYPES } from '../../lib/formations'

export default function FormationSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-transparent text-green-400 font-bold text-sm border-none outline-none cursor-pointer appearance-none"
      style={{ WebkitAppearance: 'none' }}
    >
      {FORMATION_TYPES.map(f => (
        <option key={f} value={f} style={{ background: '#111827', color: '#4ade80' }}>{f}</option>
      ))}
    </select>
  )
}

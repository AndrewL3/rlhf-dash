import { FLAG_TYPES } from '../types'
import type { FlagType } from '../types'

const FLAG_LABELS: Record<FlagType, string> = {
  hallucination: 'Hallucination',
  harmful: 'Harmful',
  refusal_failure: 'Refusal Failure',
  pii_leak: 'PII Leak',
}

interface FlagTogglesProps {
  flags: FlagType[]
  onToggleFlag: (flag: FlagType) => void
}

export function FlagToggles({ flags, onToggleFlag }: FlagTogglesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FLAG_TYPES.map((flag) => {
        const active = flags.includes(flag)
        return (
          <button
            key={flag}
            type="button"
            onClick={() => onToggleFlag(flag)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              active
                ? 'bg-red-900/50 text-red-300 border border-red-700'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
            }`}
          >
            {FLAG_LABELS[flag]}
          </button>
        )
      })}
    </div>
  )
}

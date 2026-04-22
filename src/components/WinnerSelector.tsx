import type { Winner } from '../types'

interface WinnerSelectorProps {
  winner: Winner | null
  onSetWinner: (w: Winner) => void
}

const OPTIONS: { value: Winner; label: string; hint: string }[] = [
  { value: 'a', label: 'Left', hint: '1' },
  { value: 'b', label: 'Right', hint: '2' },
  { value: 'tie', label: 'Tie', hint: '3' },
]

export function WinnerSelector({ winner, onSetWinner }: WinnerSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {OPTIONS.map(({ value, label, hint }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSetWinner(value)}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            winner === value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {label}
          <kbd className="ml-2 text-xs opacity-50">{hint}</kbd>
        </button>
      ))}
    </div>
  )
}

import type { ActiveView } from '../types'

interface HeaderProps {
  activeView: ActiveView
  onSetView: (view: ActiveView) => void
}

export function Header({ activeView, onSetView }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-100">RLHF Annotation Dashboard</h1>
      <nav className="flex gap-1 bg-gray-900 rounded-lg p-1">
        <button
          type="button"
          onClick={() => onSetView('rating')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            activeView === 'rating'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Rating
        </button>
        <button
          type="button"
          disabled
          className="px-4 py-1.5 rounded text-sm font-medium text-gray-600 cursor-not-allowed"
        >
          Analytics
        </button>
      </nav>
    </header>
  )
}

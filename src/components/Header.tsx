import type { ActiveView } from '../types'

interface HeaderProps {
  activeView: ActiveView
  onSetView: (view: ActiveView) => void
  onExport: () => void
  canExport: boolean
}

export function Header({ activeView, onSetView, onExport, canExport }: HeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-100">RLHF Annotation Dashboard</h1>
        <button
          type="button"
          onClick={onExport}
          disabled={!canExport}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            canExport
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-gray-800 text-gray-600 cursor-not-allowed'
          }`}
        >
          Export JSONL
        </button>
      </div>
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
          onClick={() => onSetView('analytics')}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            activeView === 'analytics'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Analytics
        </button>
      </nav>
    </header>
  )
}

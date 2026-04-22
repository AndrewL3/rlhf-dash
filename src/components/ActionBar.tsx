interface ActionBarProps {
  onSubmit: () => void
  onUndo: () => void
  canSubmit: boolean
  canUndo: boolean
}

export function ActionBar({ onSubmit, onUndo, canSubmit, canUndo }: ActionBarProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Undo
        <kbd className="ml-2 text-xs opacity-50">Ctrl+Z</kbd>
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="px-6 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Submit
        <kbd className="ml-2 text-xs opacity-50">Enter</kbd>
      </button>
    </div>
  )
}

import { useState } from 'react'

const STORAGE_KEY = 'rlhf-guide-dismissed'

export function WelcomeGuide() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {}
  }

  return (
    <div className="mb-6 border-l-2 border-gray-800 pl-4 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-300">
            Compare two LLM responses to the same prompt. Score each on
            quality dimensions (1–5), flag issues, then pick a winner.
          </p>
          <p className="text-xs text-gray-500">
            <span className="text-gray-400">Dimensions:</span>{' '}
            helpfulness (task completion) · safety (harm avoidance) ·
            accuracy (factual correctness) · coherence (logical flow)
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            <span><kbd className="font-mono text-gray-400">1</kbd> Left</span>
            <span><kbd className="font-mono text-gray-400">2</kbd> Right</span>
            <span><kbd className="font-mono text-gray-400">3</kbd> Tie</span>
            <span><kbd className="font-mono text-gray-400">Enter</kbd> Submit</span>
            <span><kbd className="font-mono text-gray-400">Ctrl+Z</kbd> Undo</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-gray-500 hover:text-gray-400 transition-colors shrink-0"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}

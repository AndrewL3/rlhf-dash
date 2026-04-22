import { DIMENSIONS } from '../types'
import type { Dimension, DimensionScores } from '../types'

interface DimensionScorerProps {
  scores: DimensionScores
  onSetScore: (dimension: Dimension, value: number) => void
}

export function DimensionScorer({ scores, onSetScore }: DimensionScorerProps) {
  return (
    <div className="space-y-2">
      {DIMENSIONS.map((dim) => (
        <div key={dim} className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-24">{dim}</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onSetScore(dim, value)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  scores[dim] === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

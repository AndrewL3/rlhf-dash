import type { Response, DimensionScores, FlagType, Dimension } from '../types'
import { DEFAULT_SCORES } from '../types'
import { ResponseCard } from './ResponseCard'
import { DimensionScorer } from './DimensionScorer'
import { FlagToggles } from './FlagToggles'

interface ResponsePanelProps {
  left: Response
  right: Response
  scores: Record<string, DimensionScores>
  flags: Record<string, FlagType[]>
  onSetScore: (responseId: string, dimension: Dimension, value: number) => void
  onToggleFlag: (responseId: string, flag: FlagType) => void
}

export function ResponsePanel({
  left,
  right,
  scores,
  flags,
  onSetScore,
  onToggleFlag,
}: ResponsePanelProps) {
  const sides = [
    { response: left, label: 'Left' },
    { response: right, label: 'Right' },
  ]

  return (
    <div className="grid grid-cols-2 gap-6">
      {sides.map(({ response, label }) => (
        <div key={response.id} className="space-y-4">
          <ResponseCard text={response.text} label={label} />
          <DimensionScorer
            scores={scores[response.id] ?? { ...DEFAULT_SCORES }}
            onSetScore={(dim, val) => onSetScore(response.id, dim, val)}
          />
          <FlagToggles
            flags={flags[response.id] ?? []}
            onToggleFlag={(flag) => onToggleFlag(response.id, flag)}
          />
        </div>
      ))}
    </div>
  )
}

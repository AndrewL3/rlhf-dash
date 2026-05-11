import type {
  Prompt,
  Response,
  DimensionScores,
  FlagType,
  Winner,
  Dimension,
} from '../types'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { PromptCard } from './PromptCard'
import { ResponsePanel } from './ResponsePanel'
import { WinnerSelector } from './WinnerSelector'
import { Timer } from './Timer'
import { ActionBar } from './ActionBar'

interface RatingViewProps {
  currentPrompt: Prompt
  displayOrder: { left: Response; right: Response }
  winner: Winner | null
  scores: Record<string, DimensionScores>
  flags: Record<string, FlagType[]>
  timeElapsed: number
  onSetWinner: (w: Winner) => void
  onSetScore: (responseId: string, dimension: Dimension, value: number) => void
  onToggleFlag: (responseId: string, flag: FlagType) => void
  onSubmit: () => void
  onUndo: () => void
  canUndo: boolean
}

export function RatingView({
  currentPrompt,
  displayOrder,
  winner,
  scores,
  flags,
  timeElapsed,
  onSetWinner,
  onSetScore,
  onToggleFlag,
  onSubmit,
  onUndo,
  canUndo,
}: RatingViewProps) {
  useKeyboardShortcuts({
    '1': () => onSetWinner('a'),
    '2': () => onSetWinner('b'),
    '3': () => onSetWinner('tie'),
    Enter: () => {
      if (winner !== null) onSubmit()
    },
    'ctrl+z': () => onUndo(),
  })

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <PromptCard text={currentPrompt.text} domain={currentPrompt.domain} />
        </div>
        <Timer timeElapsed={timeElapsed} />
      </div>

      <div className="mt-6">
        <ResponsePanel
          left={displayOrder.left}
          right={displayOrder.right}
          scores={scores}
          flags={flags}
          onSetScore={onSetScore}
          onToggleFlag={onToggleFlag}
        />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800/50 flex items-center justify-center gap-6">
        <WinnerSelector winner={winner} onSetWinner={onSetWinner} />
        <div className="w-px h-8 bg-gray-800" />
        <ActionBar
          onSubmit={onSubmit}
          onUndo={onUndo}
          canSubmit={winner !== null}
          canUndo={canUndo}
        />
      </div>
    </div>
  )
}

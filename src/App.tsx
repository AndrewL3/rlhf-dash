import { useState } from 'react'
import seedData from './data/seed.json'
import type { Prompt, ActiveView } from './types'
import { useAnnotationSession } from './hooks/useAnnotationSession'
import { Header } from './components/Header'
import { ProgressBar } from './components/ProgressBar'
import { RatingView } from './components/RatingView'

const prompts = seedData as Prompt[]

export const App = () => {
  const [activeView, setActiveView] = useState<ActiveView>('rating')
  const session = useAnnotationSession(prompts)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        <Header activeView={activeView} onSetView={setActiveView} />
        <ProgressBar
          completed={session.completedAnnotations.length}
          total={session.total}
        />

        {activeView === 'rating' &&
          session.currentPrompt &&
          session.displayOrder.left &&
          session.displayOrder.right && (
            <RatingView
              currentPrompt={session.currentPrompt}
              displayOrder={{
                left: session.displayOrder.left,
                right: session.displayOrder.right,
              }}
              winner={session.winner}
              scores={session.scores}
              flags={session.flags}
              timeElapsed={session.timeElapsed}
              onSetWinner={session.setWinner}
              onSetScore={session.setScore}
              onToggleFlag={session.toggleFlag}
              onSubmit={session.submit}
              onUndo={session.undo}
              canUndo={session.completedAnnotations.length > 0}
            />
          )}

        {session.isComplete && (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-green-400">
              All prompts rated!
            </p>
            <p className="mt-2 text-gray-400">
              {session.total} annotations completed.
            </p>
            <button
              type="button"
              onClick={session.undo}
              className="mt-6 px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Undo last
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

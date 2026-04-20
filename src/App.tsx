import seedData from './data/seed.json'
import type { Prompt } from './types'
import { useAnnotationSession } from './hooks/useAnnotationSession'

const prompts = seedData as Prompt[]

export const App = () => {
  const session = useAnnotationSession(prompts)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-2xl font-bold">RLHF Annotation Dashboard</h1>

      <div className="mt-4 text-sm text-gray-400">
        <p>
          Progress: {session.completedAnnotations.length} / {session.total}
        </p>
        {session.currentPrompt && (
          <p className="mt-2">
            Current prompt: {session.currentPrompt.text}
          </p>
        )}
        {session.isComplete && (
          <p className="mt-2 text-green-400">All prompts rated!</p>
        )}
      </div>
    </div>
  )
}

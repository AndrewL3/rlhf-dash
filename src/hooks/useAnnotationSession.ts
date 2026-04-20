import { useState, useCallback, useRef } from 'react'
import type {
  Prompt,
  Response,
  Annotation,
  DimensionScores,
  FlagType,
  Winner,
  Dimension,
} from '../types'
import { DEFAULT_SCORES } from '../types'
import { useTimer } from './useTimer'
import { useBlindOrder } from './useBlindOrder'

interface AnnotationSession {
  currentPrompt: Prompt | null
  displayOrder: { left: Response | null; right: Response | null }
  winner: Winner | null
  scores: Record<string, DimensionScores>
  flags: Record<string, FlagType[]>
  timeElapsed: number
  completedAnnotations: Annotation[]
  isComplete: boolean
  total: number
  setWinner: (w: Winner) => void
  setScore: (responseId: string, dimension: Dimension, value: number) => void
  toggleFlag: (responseId: string, flag: FlagType) => void
  submit: () => void
  undo: () => void
}

export function useAnnotationSession(prompts: Prompt[]): AnnotationSession {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedAnnotations, setCompletedAnnotations] = useState<Annotation[]>([])
  const [winner, setWinnerState] = useState<Winner | null>(null)
  const winnerRef = useRef<Winner | null>(null)
  const [scores, setScores] = useState<Record<string, DimensionScores>>({})
  const [flags, setFlags] = useState<Record<string, FlagType[]>>({})

  const currentPrompt = currentIndex < prompts.length ? prompts[currentIndex] : null
  const { left, right, displayOrder } = useBlindOrder(currentPrompt)
  const { timeElapsed, reset: resetTimer, getElapsed } = useTimer()

  const initScoresAndFlags = useCallback(
    (prompt: Prompt) => {
      const [a, b] = prompt.responses
      setScores({
        [a.id]: { ...DEFAULT_SCORES },
        [b.id]: { ...DEFAULT_SCORES },
      })
      setFlags({ [a.id]: [], [b.id]: [] })
    },
    []
  )

  const setWinner = useCallback((w: Winner) => {
    winnerRef.current = w
    setWinnerState(w)
  }, [])

  if (currentPrompt && Object.keys(scores).length === 0) {
    initScoresAndFlags(currentPrompt)
  }

  const setScore = useCallback(
    (responseId: string, dimension: Dimension, value: number) => {
      setScores((prev) => ({
        ...prev,
        [responseId]: { ...prev[responseId], [dimension]: value },
      }))
    },
    []
  )

  const toggleFlag = useCallback(
    (responseId: string, flag: FlagType) => {
      setFlags((prev) => {
        const current = prev[responseId] ?? []
        const updated = current.includes(flag)
          ? current.filter((f) => f !== flag)
          : [...current, flag]
        return { ...prev, [responseId]: updated }
      })
    },
    []
  )

  const submit = useCallback(() => {
    const currentWinner = winnerRef.current
    if (!currentPrompt || currentWinner === null) return

    const elapsed = getElapsed()

    const annotation: Annotation = {
      promptId: currentPrompt.id,
      responseAId: currentPrompt.responses[0].id,
      responseBId: currentPrompt.responses[1].id,
      displayOrder: displayOrder as [string, string],
      winner: currentWinner,
      scores: { ...scores },
      flags: { ...flags },
      timeSpentMs: elapsed,
      timestamp: new Date().toISOString(),
    }

    setCompletedAnnotations((prev) => [...prev, annotation])
    winnerRef.current = null
    setWinnerState(null)

    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex)

    if (nextIndex < prompts.length) {
      initScoresAndFlags(prompts[nextIndex])
    }

    resetTimer()
  }, [
    currentPrompt,
    scores,
    flags,
    displayOrder,
    currentIndex,
    prompts,
    getElapsed,
    resetTimer,
    initScoresAndFlags,
  ])

  const undo = useCallback(() => {
    if (completedAnnotations.length === 0) return

    const lastAnnotation = completedAnnotations[completedAnnotations.length - 1]
    setCompletedAnnotations((prev) => prev.slice(0, -1))
    setCurrentIndex((prev) => prev - 1)
    winnerRef.current = lastAnnotation.winner
    setWinnerState(lastAnnotation.winner)
    setScores(lastAnnotation.scores)
    setFlags(lastAnnotation.flags)
    resetTimer()
  }, [completedAnnotations, resetTimer])

  return {
    currentPrompt,
    displayOrder: { left, right },
    winner,
    scores,
    flags,
    timeElapsed,
    completedAnnotations,
    isComplete: currentIndex >= prompts.length,
    total: prompts.length,
    setWinner,
    setScore,
    toggleFlag,
    submit,
    undo,
  }
}

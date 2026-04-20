import { useMemo } from 'react'
import type { Prompt, Response } from '../types'

interface BlindOrder {
  left: Response | null
  right: Response | null
  displayOrder: [string, string] | []
}

export function useBlindOrder(prompt: Prompt | null): BlindOrder {
  return useMemo(() => {
    if (!prompt) {
      return { left: null, right: null, displayOrder: [] as [] }
    }

    const [a, b] = prompt.responses
    const swap = Math.random() < 0.5

    const left = swap ? b : a
    const right = swap ? a : b

    return {
      left,
      right,
      displayOrder: [left.id, right.id] as [string, string],
    }
  }, [prompt?.id])
}

import { renderHook, act } from '@testing-library/react'
import { useAnnotationSession } from '../useAnnotationSession'
import type { Prompt } from '../../types'

const mockPrompts: Prompt[] = [
  {
    id: 'p001',
    text: 'First prompt',
    domain: 'science',
    responses: [
      { id: 'r001a', model: 'model-a', text: 'Response A1' },
      { id: 'r001b', model: 'model-b', text: 'Response B1' },
    ],
  },
  {
    id: 'p002',
    text: 'Second prompt',
    domain: 'coding',
    responses: [
      { id: 'r002a', model: 'model-a', text: 'Response A2' },
      { id: 'r002b', model: 'model-b', text: 'Response B2' },
    ],
  },
]

describe('useAnnotationSession', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with the first prompt', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))

    expect(result.current.currentPrompt?.id).toBe('p001')
    expect(result.current.completedAnnotations).toHaveLength(0)
    expect(result.current.isComplete).toBe(false)
  })

  it('provides blinded display order', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))

    expect(result.current.displayOrder.left).toBeDefined()
    expect(result.current.displayOrder.right).toBeDefined()
    const ids = [
      result.current.displayOrder.left!.id,
      result.current.displayOrder.right!.id,
    ].sort()
    expect(ids).toEqual(['r001a', 'r001b'])
  })

  it('sets winner', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))

    act(() => {
      result.current.setWinner('a')
    })

    expect(result.current.winner).toBe('a')
  })

  it('sets dimension scores', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))
    const leftId = result.current.displayOrder.left!.id

    act(() => {
      result.current.setScore(leftId, 'helpfulness', 4)
    })

    expect(result.current.scores[leftId].helpfulness).toBe(4)
  })

  it('toggles flags on and off', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))
    const leftId = result.current.displayOrder.left!.id

    act(() => {
      result.current.toggleFlag(leftId, 'hallucination')
    })
    expect(result.current.flags[leftId]).toContain('hallucination')

    act(() => {
      result.current.toggleFlag(leftId, 'hallucination')
    })
    expect(result.current.flags[leftId]).not.toContain('hallucination')
  })

  it('submits and advances to next prompt', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))

    act(() => {
      result.current.setWinner('a')
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    act(() => {
      result.current.submit()
    })

    expect(result.current.completedAnnotations).toHaveLength(1)
    expect(result.current.currentPrompt?.id).toBe('p002')
    expect(result.current.winner).toBeNull()
  })

  it('submit builds correct annotation shape', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))
    const leftId = result.current.displayOrder.left!.id

    act(() => {
      result.current.setWinner('a')
      result.current.setScore(leftId, 'helpfulness', 5)
      result.current.toggleFlag(leftId, 'hallucination')
    })

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    act(() => {
      result.current.submit()
    })

    const annotation = result.current.completedAnnotations[0]
    expect(annotation.promptId).toBe('p001')
    expect(annotation.winner).toBe('a')
    expect(annotation.scores[leftId].helpfulness).toBe(5)
    expect(annotation.flags[leftId]).toContain('hallucination')
    expect(annotation.timeSpentMs).toBeGreaterThan(0)
    expect(annotation.displayOrder).toHaveLength(2)
    expect(annotation.timestamp).toBeDefined()
  })

  it('undo restores previous state', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))

    act(() => {
      result.current.setWinner('b')
    })

    act(() => {
      result.current.submit()
    })

    act(() => {
      result.current.undo()
    })

    expect(result.current.currentPrompt?.id).toBe('p001')
    expect(result.current.winner).toBe('b')
    expect(result.current.completedAnnotations).toHaveLength(0)
  })

  it('isComplete is true when all prompts are rated', () => {
    const { result } = renderHook(() => useAnnotationSession(mockPrompts))

    act(() => {
      result.current.setWinner('a')
      result.current.submit()
    })

    act(() => {
      result.current.setWinner('b')
      result.current.submit()
    })

    expect(result.current.isComplete).toBe(true)
    expect(result.current.currentPrompt).toBeNull()
  })
})

import { renderHook } from '@testing-library/react'
import { useBlindOrder } from '../useBlindOrder'
import type { Prompt } from '../../types'

const mockPrompt: Prompt = {
  id: 'p001',
  text: 'Test prompt',
  domain: 'science',
  responses: [
    { id: 'r001a', model: 'model-a', text: 'Response A' },
    { id: 'r001b', model: 'model-b', text: 'Response B' },
  ],
}

describe('useBlindOrder', () => {
  it('returns left and right responses', () => {
    const { result } = renderHook(() => useBlindOrder(mockPrompt))

    expect(result.current.left).toBeDefined()
    expect(result.current.right).toBeDefined()
    expect(result.current.left!.id).not.toBe(result.current.right!.id)
  })

  it('returns both original responses', () => {
    const { result } = renderHook(() => useBlindOrder(mockPrompt))

    const ids = [result.current.left!.id, result.current.right!.id].sort()
    expect(ids).toEqual(['r001a', 'r001b'])
  })

  it('returns displayOrder as [leftId, rightId]', () => {
    const { result } = renderHook(() => useBlindOrder(mockPrompt))

    expect(result.current.displayOrder).toEqual([
      result.current.left!.id,
      result.current.right!.id,
    ])
  })

  it('returns stable order on re-render with same prompt', () => {
    const { result, rerender } = renderHook(() => useBlindOrder(mockPrompt))

    const firstLeft = result.current.left!.id
    rerender()

    expect(result.current.left!.id).toBe(firstLeft)
  })

  it('returns null fields when prompt is null', () => {
    const { result } = renderHook(() => useBlindOrder(null))

    expect(result.current.left).toBeNull()
    expect(result.current.right).toBeNull()
    expect(result.current.displayOrder).toEqual([])
  })
})

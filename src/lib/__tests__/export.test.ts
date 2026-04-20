import { describe, it, expect } from 'vitest'
import { toJSONL } from '../export'
import type { Annotation, Prompt } from '../../types'

const prompts: Prompt[] = [
  {
    id: 'p001',
    text: 'Test prompt',
    domain: 'science',
    responses: [
      { id: 'r001a', model: 'model-a', text: 'Response A text' },
      { id: 'r001b', model: 'model-b', text: 'Response B text' },
    ],
  },
]

const makeAnnotation = (
  overrides: Partial<Annotation> = {}
): Annotation => ({
  promptId: 'p001',
  responseAId: 'r001a',
  responseBId: 'r001b',
  displayOrder: ['r001a', 'r001b'] as [string, string],
  winner: 'a',
  scores: {
    r001a: { helpfulness: 4, safety: 5, accuracy: 3, coherence: 4 },
    r001b: { helpfulness: 3, safety: 5, accuracy: 2, coherence: 3 },
  },
  flags: { r001a: [], r001b: ['hallucination'] },
  timeSpentMs: 45000,
  timestamp: '2026-04-20T10:00:00.000Z',
  ...overrides,
})

describe('toJSONL', () => {
  it('converts annotation to JSONL with chosen/rejected', () => {
    const annotations = [makeAnnotation({ winner: 'a' })]
    const result = toJSONL(annotations, prompts)
    const parsed = JSON.parse(result.trim())

    expect(parsed.prompt).toBe('Test prompt')
    expect(parsed.chosen).toBe('Response A text')
    expect(parsed.rejected).toBe('Response B text')
  })

  it('respects displayOrder for winner mapping', () => {
    const annotations = [
      makeAnnotation({
        winner: 'a',
        displayOrder: ['r001b', 'r001a'],
      }),
    ]
    const result = toJSONL(annotations, prompts)
    const parsed = JSON.parse(result.trim())

    expect(parsed.chosen).toBe('Response B text')
    expect(parsed.rejected).toBe('Response A text')
  })

  it('excludes ties', () => {
    const annotations = [makeAnnotation({ winner: 'tie' })]
    const result = toJSONL(annotations, prompts)

    expect(result.trim()).toBe('')
  })

  it('includes metadata', () => {
    const annotations = [makeAnnotation()]
    const result = toJSONL(annotations, prompts)
    const parsed = JSON.parse(result.trim())

    expect(parsed.metadata.timeSpentMs).toBe(45000)
    expect(parsed.metadata.scores).toBeDefined()
    expect(parsed.metadata.flags).toBeDefined()
    expect(parsed.metadata.timestamp).toBe('2026-04-20T10:00:00.000Z')
    expect(parsed.metadata.displayOrder).toEqual(['r001a', 'r001b'])
  })

  it('outputs one line per annotation', () => {
    const annotations = [
      makeAnnotation(),
      makeAnnotation({ timestamp: '2026-04-20T10:01:00.000Z' }),
    ]
    const result = toJSONL(annotations, prompts)
    const lines = result.trim().split('\n')

    expect(lines).toHaveLength(2)
    lines.forEach((line: string) => {
      expect(() => JSON.parse(line)).not.toThrow()
    })
  })
})

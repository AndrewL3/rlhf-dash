import { describe, it, expect } from 'vitest'
import { scoreDistribution, winRates, flagCounts, timingStats } from '../metrics'
import type { Annotation, Prompt } from '../../types'

const prompts: Prompt[] = [
  {
    id: 'p001',
    text: 'Test prompt',
    domain: 'science',
    responses: [
      { id: 'r001a', model: 'model-a', text: 'A' },
      { id: 'r001b', model: 'model-b', text: 'B' },
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
    r001b: { helpfulness: 3, safety: 4, accuracy: 2, coherence: 3 },
  },
  flags: { r001a: [], r001b: [] },
  timeSpentMs: 30000,
  timestamp: '2026-04-20T10:00:00.000Z',
  ...overrides,
})

describe('scoreDistribution', () => {
  it('returns counts for scores 1-5 for a dimension', () => {
    const annotations = [
      makeAnnotation({
        scores: {
          r001a: { helpfulness: 4, safety: 5, accuracy: 3, coherence: 4 },
          r001b: { helpfulness: 4, safety: 3, accuracy: 2, coherence: 3 },
        },
      }),
    ]
    const result = scoreDistribution(annotations, 'helpfulness')

    expect(result).toEqual([
      { score: 1, count: 0 },
      { score: 2, count: 0 },
      { score: 3, count: 0 },
      { score: 4, count: 2 },
      { score: 5, count: 0 },
    ])
  })

  it('returns all zeros for empty annotations', () => {
    const result = scoreDistribution([], 'helpfulness')
    expect(result).toEqual([
      { score: 1, count: 0 },
      { score: 2, count: 0 },
      { score: 3, count: 0 },
      { score: 4, count: 0 },
      { score: 5, count: 0 },
    ])
  })
})

describe('winRates', () => {
  it('counts wins per model excluding ties', () => {
    const annotations = [
      makeAnnotation({ winner: 'a', displayOrder: ['r001a', 'r001b'] }),
      makeAnnotation({ winner: 'b', displayOrder: ['r001a', 'r001b'] }),
      makeAnnotation({ winner: 'a', displayOrder: ['r001b', 'r001a'] }),
      makeAnnotation({ winner: 'tie' }),
    ]
    const result = winRates(annotations, prompts)

    const modelA = result.find((r: { model: string }) => r.model === 'model-a')!
    const modelB = result.find((r: { model: string }) => r.model === 'model-b')!

    expect(modelA.wins).toBe(1)
    expect(modelB.wins).toBe(2)
  })

  it('returns empty array for no annotations', () => {
    expect(winRates([], prompts)).toEqual([])
  })
})

describe('flagCounts', () => {
  it('counts flags across all annotations', () => {
    const annotations = [
      makeAnnotation({
        flags: {
          r001a: ['hallucination'],
          r001b: ['hallucination', 'harmful'],
        },
      }),
      makeAnnotation({
        flags: { r001a: ['pii_leak'], r001b: [] },
      }),
    ]
    const result = flagCounts(annotations)

    expect(result).toEqual(
      expect.arrayContaining([
        { flag: 'hallucination', count: 2 },
        { flag: 'harmful', count: 1 },
        { flag: 'pii_leak', count: 1 },
        { flag: 'refusal_failure', count: 0 },
      ])
    )
  })
})

describe('timingStats', () => {
  it('computes avg, median, and count', () => {
    const annotations = [
      makeAnnotation({ timeSpentMs: 10000 }),
      makeAnnotation({ timeSpentMs: 20000 }),
      makeAnnotation({ timeSpentMs: 60000 }),
    ]
    const result = timingStats(annotations)

    expect(result.count).toBe(3)
    expect(result.avg).toBe(30000)
    expect(result.median).toBe(20000)
  })

  it('returns zeros for empty annotations', () => {
    const result = timingStats([])
    expect(result).toEqual({ avg: 0, median: 0, count: 0 })
  })
})

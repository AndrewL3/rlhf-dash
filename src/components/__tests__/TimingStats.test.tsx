import { render, screen } from '@testing-library/react'
import { TimingStats } from '../TimingStats'
import type { Annotation } from '../../types'

const makeAnnotation = (timeSpentMs: number): Annotation => ({
  promptId: 'p1',
  responseAId: 'r1',
  responseBId: 'r2',
  displayOrder: ['r1', 'r2'] as [string, string],
  winner: 'a',
  scores: {
    r1: { helpfulness: 3, safety: 3, accuracy: 3, coherence: 3 },
    r2: { helpfulness: 3, safety: 3, accuracy: 3, coherence: 3 },
  },
  flags: { r1: [], r2: [] },
  timeSpentMs,
  timestamp: '2026-04-22T10:00:00.000Z',
})

describe('TimingStats', () => {
  it('renders average time formatted as mm:ss', () => {
    const annotations = [makeAnnotation(30000), makeAnnotation(60000), makeAnnotation(270000)]
    render(<TimingStats annotations={annotations} />)
    expect(screen.getByText('02:00')).toBeInTheDocument()
  })

  it('renders median time formatted as mm:ss', () => {
    const annotations = [
      makeAnnotation(10000),
      makeAnnotation(30000),
      makeAnnotation(90000),
    ]
    render(<TimingStats annotations={annotations} />)
    expect(screen.getByText('00:30')).toBeInTheDocument()
  })

  it('renders total annotation count', () => {
    const annotations = [makeAnnotation(10000), makeAnnotation(20000)]
    render(<TimingStats annotations={annotations} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders labels', () => {
    const annotations = [makeAnnotation(10000)]
    render(<TimingStats annotations={annotations} />)
    expect(screen.getByText('Avg Time')).toBeInTheDocument()
    expect(screen.getByText('Median Time')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('renders zeros for empty annotations', () => {
    render(<TimingStats annotations={[]} />)
    expect(screen.getAllByText('00:00')).toHaveLength(2)
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})

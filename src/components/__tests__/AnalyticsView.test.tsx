import { render, screen } from '@testing-library/react'
import { AnalyticsView } from '../AnalyticsView'
import type { Annotation, Prompt } from '../../types'

vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual<typeof import('recharts')>('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container" style={{ width: 300, height: 200 }}>
        {children}
      </div>
    ),
  }
})

const prompts: Prompt[] = [
  {
    id: 'p1',
    text: 'Test prompt',
    domain: 'science',
    responses: [
      { id: 'r1', model: 'model-a', text: 'A' },
      { id: 'r2', model: 'model-b', text: 'B' },
    ],
  },
]

const makeAnnotation = (): Annotation => ({
  promptId: 'p1',
  responseAId: 'r1',
  responseBId: 'r2',
  displayOrder: ['r1', 'r2'] as [string, string],
  winner: 'a',
  scores: {
    r1: { helpfulness: 4, safety: 5, accuracy: 3, coherence: 4 },
    r2: { helpfulness: 3, safety: 4, accuracy: 2, coherence: 3 },
  },
  flags: { r1: ['hallucination'], r2: [] },
  timeSpentMs: 30000,
  timestamp: '2026-04-22T10:00:00.000Z',
})

describe('AnalyticsView', () => {
  it('renders empty state when no annotations', () => {
    render(<AnalyticsView annotations={[]} prompts={prompts} />)
    expect(
      screen.getByText('Complete some annotations to see analytics.')
    ).toBeInTheDocument()
  })

  it('does not render charts when no annotations', () => {
    render(<AnalyticsView annotations={[]} prompts={prompts} />)
    expect(screen.queryByText('Score Distribution')).not.toBeInTheDocument()
  })

  it('renders all chart sections when annotations exist', () => {
    render(<AnalyticsView annotations={[makeAnnotation()]} prompts={prompts} />)
    expect(screen.getByText('Score Distribution')).toBeInTheDocument()
    expect(screen.getByText('Wins')).toBeInTheDocument()
    expect(screen.getByText('Flags')).toBeInTheDocument()
    expect(screen.getByText('Timing')).toBeInTheDocument()
  })

  it('renders timing stats values', () => {
    render(<AnalyticsView annotations={[makeAnnotation()]} prompts={prompts} />)
    expect(screen.getAllByText('00:30')).toHaveLength(2)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { ScoreDistribution } from '../ScoreDistribution'
import type { Annotation } from '../../types'

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

const makeAnnotation = (scores: Record<string, { helpfulness: number; safety: number; accuracy: number; coherence: number }>): Annotation => ({
  promptId: 'p1',
  responseAId: 'r1',
  responseBId: 'r2',
  displayOrder: ['r1', 'r2'] as [string, string],
  winner: 'a',
  scores,
  flags: { r1: [], r2: [] },
  timeSpentMs: 30000,
  timestamp: '2026-04-22T10:00:00.000Z',
})

describe('ScoreDistribution', () => {
  it('renders a heading for each dimension', () => {
    render(<ScoreDistribution annotations={[]} />)
    expect(screen.getByText('Helpfulness')).toBeInTheDocument()
    expect(screen.getByText('Safety')).toBeInTheDocument()
    expect(screen.getByText('Accuracy')).toBeInTheDocument()
    expect(screen.getByText('Coherence')).toBeInTheDocument()
  })

  it('renders 4 charts', () => {
    render(<ScoreDistribution annotations={[]} />)
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(4)
  })

  it('renders with annotation data without crashing', () => {
    const annotations = [
      makeAnnotation({
        r1: { helpfulness: 4, safety: 5, accuracy: 3, coherence: 4 },
        r2: { helpfulness: 3, safety: 4, accuracy: 2, coherence: 3 },
      }),
    ]
    const { container } = render(<ScoreDistribution annotations={annotations} />)
    expect(container).toBeTruthy()
  })
})

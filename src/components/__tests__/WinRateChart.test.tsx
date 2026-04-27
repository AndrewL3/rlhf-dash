import { render, screen } from '@testing-library/react'
import { WinRateChart } from '../WinRateChart'
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

const makeAnnotation = (overrides: Partial<Annotation> = {}): Annotation => ({
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
  timeSpentMs: 30000,
  timestamp: '2026-04-22T10:00:00.000Z',
  ...overrides,
})

describe('WinRateChart', () => {
  it('renders the heading', () => {
    render(<WinRateChart annotations={[]} prompts={prompts} />)
    expect(screen.getByText('Wins')).toBeInTheDocument()
  })

  it('renders a chart container when there are annotations', () => {
    const annotations = [makeAnnotation()]
    render(<WinRateChart annotations={annotations} prompts={prompts} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('renders empty message when all annotations are ties', () => {
    const annotations = [makeAnnotation({ winner: 'tie' })]
    render(<WinRateChart annotations={annotations} prompts={prompts} />)
    expect(screen.getByText('No win data yet.')).toBeInTheDocument()
  })

  it('renders empty message when no annotations', () => {
    render(<WinRateChart annotations={[]} prompts={prompts} />)
    expect(screen.getByText('No win data yet.')).toBeInTheDocument()
  })
})

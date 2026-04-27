import { render, screen } from '@testing-library/react'
import { FlagBreakdown } from '../FlagBreakdown'
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

const makeAnnotation = (flags: Record<string, string[]>): Annotation => ({
  promptId: 'p1',
  responseAId: 'r1',
  responseBId: 'r2',
  displayOrder: ['r1', 'r2'] as [string, string],
  winner: 'a',
  scores: {
    r1: { helpfulness: 3, safety: 3, accuracy: 3, coherence: 3 },
    r2: { helpfulness: 3, safety: 3, accuracy: 3, coherence: 3 },
  },
  flags: flags as Annotation['flags'],
  timeSpentMs: 30000,
  timestamp: '2026-04-22T10:00:00.000Z',
})

describe('FlagBreakdown', () => {
  it('renders the heading', () => {
    render(<FlagBreakdown annotations={[]} />)
    expect(screen.getByText('Flags')).toBeInTheDocument()
  })

  it('renders a chart container', () => {
    render(<FlagBreakdown annotations={[]} />)
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument()
  })

  it('renders with flag data without crashing', () => {
    const annotations = [
      makeAnnotation({ r1: ['hallucination'], r2: ['harmful', 'pii_leak'] }),
    ]
    const { container } = render(<FlagBreakdown annotations={annotations} />)
    expect(container).toBeTruthy()
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { DimensionScorer } from '../DimensionScorer'
import { DIMENSIONS, DEFAULT_SCORES } from '../../types'

describe('DimensionScorer', () => {
  it('renders a row for each dimension', () => {
    render(<DimensionScorer scores={{ ...DEFAULT_SCORES }} onSetScore={vi.fn()} />)
    for (const dim of DIMENSIONS) {
      expect(screen.getByText(dim)).toBeInTheDocument()
    }
  })

  it('renders 5 score buttons per dimension', () => {
    render(<DimensionScorer scores={{ ...DEFAULT_SCORES }} onSetScore={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(DIMENSIONS.length * 5)
  })

  it('calls onSetScore with dimension and value when clicked', () => {
    const onSetScore = vi.fn()
    render(<DimensionScorer scores={{ ...DEFAULT_SCORES }} onSetScore={onSetScore} />)
    const helpfulnessButtons = screen.getAllByRole('button').slice(0, 5)
    fireEvent.click(helpfulnessButtons[3])
    expect(onSetScore).toHaveBeenCalledWith('helpfulness', 4)
  })

  it('highlights the active score', () => {
    const scores = { ...DEFAULT_SCORES, helpfulness: 3 }
    render(<DimensionScorer scores={scores} onSetScore={vi.fn()} />)
    const helpfulnessButtons = screen.getAllByRole('button').slice(0, 5)
    expect(helpfulnessButtons[2]).toHaveClass('bg-blue-600')
    expect(helpfulnessButtons[0]).not.toHaveClass('bg-blue-600')
  })
})

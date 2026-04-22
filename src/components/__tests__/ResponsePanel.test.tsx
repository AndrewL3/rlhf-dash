import { render, screen, fireEvent } from '@testing-library/react'
import { ResponsePanel } from '../ResponsePanel'
import { DEFAULT_SCORES } from '../../types'
import type { Response } from '../../types'

const left: Response = { id: 'r1', model: 'model-a', text: 'Left response text' }
const right: Response = { id: 'r2', model: 'model-b', text: 'Right response text' }

describe('ResponsePanel', () => {
  it('renders both response texts', () => {
    render(
      <ResponsePanel
        left={left}
        right={right}
        scores={{ r1: { ...DEFAULT_SCORES }, r2: { ...DEFAULT_SCORES } }}
        flags={{ r1: [], r2: [] }}
        onSetScore={vi.fn()}
        onToggleFlag={vi.fn()}
      />
    )
    expect(screen.getByText('Left response text')).toBeInTheDocument()
    expect(screen.getByText('Right response text')).toBeInTheDocument()
  })

  it('renders Left and Right labels', () => {
    render(
      <ResponsePanel
        left={left}
        right={right}
        scores={{ r1: { ...DEFAULT_SCORES }, r2: { ...DEFAULT_SCORES } }}
        flags={{ r1: [], r2: [] }}
        onSetScore={vi.fn()}
        onToggleFlag={vi.fn()}
      />
    )
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('passes score changes with correct response ID', () => {
    const onSetScore = vi.fn()
    render(
      <ResponsePanel
        left={left}
        right={right}
        scores={{ r1: { ...DEFAULT_SCORES }, r2: { ...DEFAULT_SCORES } }}
        flags={{ r1: [], r2: [] }}
        onSetScore={onSetScore}
        onToggleFlag={vi.fn()}
      />
    )
    const allButtons = screen.getAllByRole('button')
    const firstScoreButton = allButtons.find((b) => b.textContent === '1')!
    fireEvent.click(firstScoreButton)
    expect(onSetScore).toHaveBeenCalledWith('r1', 'helpfulness', 1)
  })
})

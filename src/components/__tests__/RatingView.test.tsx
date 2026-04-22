import { render, screen } from '@testing-library/react'
import { RatingView } from '../RatingView'
import type { Prompt, Response, Winner, Dimension, FlagType, DimensionScores } from '../../types'
import { DEFAULT_SCORES } from '../../types'

const mockPrompt: Prompt = {
  id: 'p1',
  text: 'Test prompt text',
  domain: 'science',
  responses: [
    { id: 'r1', model: 'model-a', text: 'Response A text' },
    { id: 'r2', model: 'model-b', text: 'Response B text' },
  ],
}

const mockLeft: Response = { id: 'r1', model: 'model-a', text: 'Response A text' }
const mockRight: Response = { id: 'r2', model: 'model-b', text: 'Response B text' }

function renderRatingView(overrides: Partial<{
  winner: Winner | null
  onSetWinner: (w: Winner) => void
  onSetScore: (id: string, dim: Dimension, val: number) => void
  onToggleFlag: (id: string, flag: FlagType) => void
  onSubmit: () => void
  onUndo: () => void
  canUndo: boolean
}> = {}) {
  const props = {
    currentPrompt: mockPrompt,
    displayOrder: { left: mockLeft, right: mockRight },
    winner: null as Winner | null,
    scores: { r1: { ...DEFAULT_SCORES }, r2: { ...DEFAULT_SCORES } } as Record<string, DimensionScores>,
    flags: { r1: [], r2: [] } as Record<string, FlagType[]>,
    timeElapsed: 0,
    onSetWinner: vi.fn(),
    onSetScore: vi.fn(),
    onToggleFlag: vi.fn(),
    onSubmit: vi.fn(),
    onUndo: vi.fn(),
    canUndo: false,
    ...overrides,
  }
  return { ...render(<RatingView {...props} />), props }
}

describe('RatingView', () => {
  it('renders prompt text', () => {
    renderRatingView()
    expect(screen.getByText('Test prompt text')).toBeInTheDocument()
  })

  it('renders both response texts', () => {
    renderRatingView()
    expect(screen.getByText('Response A text')).toBeInTheDocument()
    expect(screen.getByText('Response B text')).toBeInTheDocument()
  })

  it('renders winner selector buttons', () => {
    renderRatingView()
    expect(screen.getByRole('button', { name: /Left/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Right/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tie/ })).toBeInTheDocument()
  })

  it('renders timer at 00:00', () => {
    renderRatingView()
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('keyboard shortcut 1 sets winner to a', () => {
    const onSetWinner = vi.fn()
    renderRatingView({ onSetWinner })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))
    expect(onSetWinner).toHaveBeenCalledWith('a')
  })

  it('keyboard shortcut 2 sets winner to b', () => {
    const onSetWinner = vi.fn()
    renderRatingView({ onSetWinner })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }))
    expect(onSetWinner).toHaveBeenCalledWith('b')
  })

  it('keyboard shortcut 3 sets winner to tie', () => {
    const onSetWinner = vi.fn()
    renderRatingView({ onSetWinner })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '3' }))
    expect(onSetWinner).toHaveBeenCalledWith('tie')
  })

  it('keyboard Enter calls submit when winner is set', () => {
    const onSubmit = vi.fn()
    renderRatingView({ winner: 'a', onSubmit })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('keyboard Enter does not submit when no winner', () => {
    const onSubmit = vi.fn()
    renderRatingView({ winner: null, onSubmit })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('keyboard ctrl+z calls undo', () => {
    const onUndo = vi.fn()
    renderRatingView({ onUndo })
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true }))
    expect(onUndo).toHaveBeenCalledOnce()
  })
})

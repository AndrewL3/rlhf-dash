import { render, screen, fireEvent } from '@testing-library/react'
import { WinnerSelector } from '../WinnerSelector'

describe('WinnerSelector', () => {
  it('renders Left, Right, and Tie buttons', () => {
    render(<WinnerSelector winner={null} onSetWinner={vi.fn()} />)
    expect(screen.getByText(/Left/)).toBeInTheDocument()
    expect(screen.getByText(/Right/)).toBeInTheDocument()
    expect(screen.getByText(/Tie/)).toBeInTheDocument()
  })

  it('calls onSetWinner with correct value on click', () => {
    const onSetWinner = vi.fn()
    render(<WinnerSelector winner={null} onSetWinner={onSetWinner} />)
    fireEvent.click(screen.getByText(/Left/))
    expect(onSetWinner).toHaveBeenCalledWith('a')
    fireEvent.click(screen.getByText(/Right/))
    expect(onSetWinner).toHaveBeenCalledWith('b')
    fireEvent.click(screen.getByText(/Tie/))
    expect(onSetWinner).toHaveBeenCalledWith('tie')
  })

  it('highlights the selected winner', () => {
    render(<WinnerSelector winner="a" onSetWinner={vi.fn()} />)
    expect(screen.getByText(/Left/).closest('button')).toHaveClass('bg-blue-600')
    expect(screen.getByText(/Right/).closest('button')).not.toHaveClass('bg-blue-600')
  })

  it('shows keyboard hints', () => {
    render(<WinnerSelector winner={null} onSetWinner={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})

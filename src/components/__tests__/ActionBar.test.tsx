import { render, screen, fireEvent } from '@testing-library/react'
import { ActionBar } from '../ActionBar'

describe('ActionBar', () => {
  it('renders Submit and Undo buttons', () => {
    render(<ActionBar onSubmit={vi.fn()} onUndo={vi.fn()} canSubmit={true} canUndo={true} />)
    expect(screen.getByText(/Submit/)).toBeInTheDocument()
    expect(screen.getByText(/Undo/)).toBeInTheDocument()
  })

  it('disables Submit when canSubmit is false', () => {
    render(<ActionBar onSubmit={vi.fn()} onUndo={vi.fn()} canSubmit={false} canUndo={true} />)
    expect(screen.getByText(/Submit/).closest('button')).toBeDisabled()
  })

  it('disables Undo when canUndo is false', () => {
    render(<ActionBar onSubmit={vi.fn()} onUndo={vi.fn()} canSubmit={true} canUndo={false} />)
    expect(screen.getByText(/Undo/).closest('button')).toBeDisabled()
  })

  it('calls onSubmit when Submit is clicked', () => {
    const onSubmit = vi.fn()
    render(<ActionBar onSubmit={onSubmit} onUndo={vi.fn()} canSubmit={true} canUndo={true} />)
    fireEvent.click(screen.getByText(/Submit/).closest('button')!)
    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('calls onUndo when Undo is clicked', () => {
    const onUndo = vi.fn()
    render(<ActionBar onSubmit={vi.fn()} onUndo={onUndo} canSubmit={true} canUndo={true} />)
    fireEvent.click(screen.getByText(/Undo/).closest('button')!)
    expect(onUndo).toHaveBeenCalledOnce()
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../Header'

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header activeView="rating" onSetView={vi.fn()} />)
    expect(screen.getByText('RLHF Annotation Dashboard')).toBeInTheDocument()
  })

  it('renders Rating and Analytics tabs', () => {
    render(<Header activeView="rating" onSetView={vi.fn()} />)
    expect(screen.getByText('Rating')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('highlights the active tab', () => {
    render(<Header activeView="rating" onSetView={vi.fn()} />)
    expect(screen.getByText('Rating').closest('button')).toHaveClass('bg-gray-700')
  })

  it('disables the Analytics tab', () => {
    render(<Header activeView="rating" onSetView={vi.fn()} />)
    expect(screen.getByText('Analytics').closest('button')).toBeDisabled()
  })

  it('calls onSetView when Rating tab is clicked', () => {
    const onSetView = vi.fn()
    render(<Header activeView="rating" onSetView={onSetView} />)
    fireEvent.click(screen.getByText('Rating'))
    expect(onSetView).toHaveBeenCalledWith('rating')
  })
})

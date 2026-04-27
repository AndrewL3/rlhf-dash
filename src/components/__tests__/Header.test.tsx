import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '../Header'
import type { ActiveView } from '../../types'

const defaultProps = {
  activeView: 'rating' as ActiveView,
  onSetView: vi.fn(),
  onExport: vi.fn(),
  canExport: false,
}

function renderHeader(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, ...overrides, onSetView: overrides.onSetView ?? vi.fn(), onExport: overrides.onExport ?? vi.fn() }
  return { ...render(<Header {...props} />), props }
}

describe('Header', () => {
  it('renders the app title', () => {
    renderHeader()
    expect(screen.getByText('RLHF Annotation Dashboard')).toBeInTheDocument()
  })

  it('renders Rating and Analytics tabs', () => {
    renderHeader()
    expect(screen.getByText('Rating')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('highlights the active tab', () => {
    renderHeader({ activeView: 'rating' })
    expect(screen.getByText('Rating').closest('button')).toHaveClass('bg-gray-700')
  })

  it('analytics tab is enabled and clickable', () => {
    const onSetView = vi.fn()
    renderHeader({ onSetView })
    const analyticsBtn = screen.getByText('Analytics').closest('button')!
    expect(analyticsBtn).not.toBeDisabled()
    fireEvent.click(analyticsBtn)
    expect(onSetView).toHaveBeenCalledWith('analytics')
  })

  it('highlights analytics tab when active', () => {
    renderHeader({ activeView: 'analytics' })
    expect(screen.getByText('Analytics').closest('button')).toHaveClass('bg-gray-700')
  })

  it('calls onSetView when Rating tab is clicked', () => {
    const onSetView = vi.fn()
    renderHeader({ onSetView })
    fireEvent.click(screen.getByText('Rating'))
    expect(onSetView).toHaveBeenCalledWith('rating')
  })

  it('renders the export button', () => {
    renderHeader()
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
  })

  it('export button is disabled when canExport is false', () => {
    renderHeader({ canExport: false })
    expect(screen.getByRole('button', { name: /export/i })).toBeDisabled()
  })

  it('export button is enabled when canExport is true', () => {
    renderHeader({ canExport: true })
    expect(screen.getByRole('button', { name: /export/i })).not.toBeDisabled()
  })

  it('calls onExport when export button is clicked', () => {
    const onExport = vi.fn()
    renderHeader({ canExport: true, onExport })
    fireEvent.click(screen.getByRole('button', { name: /export/i }))
    expect(onExport).toHaveBeenCalledOnce()
  })
})

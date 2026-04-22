import { render, screen, fireEvent } from '@testing-library/react'
import { FlagToggles } from '../FlagToggles'

describe('FlagToggles', () => {
  it('renders a button for each flag type', () => {
    render(<FlagToggles flags={[]} onToggleFlag={vi.fn()} />)
    expect(screen.getByText('Hallucination')).toBeInTheDocument()
    expect(screen.getByText('Harmful')).toBeInTheDocument()
    expect(screen.getByText('Refusal Failure')).toBeInTheDocument()
    expect(screen.getByText('PII Leak')).toBeInTheDocument()
  })

  it('calls onToggleFlag with flag type when clicked', () => {
    const onToggleFlag = vi.fn()
    render(<FlagToggles flags={[]} onToggleFlag={onToggleFlag} />)
    fireEvent.click(screen.getByText('Hallucination'))
    expect(onToggleFlag).toHaveBeenCalledWith('hallucination')
  })

  it('highlights active flags', () => {
    render(<FlagToggles flags={['hallucination', 'harmful']} onToggleFlag={vi.fn()} />)
    expect(screen.getByText('Hallucination')).toHaveClass('bg-red-900/50')
    expect(screen.getByText('PII Leak')).not.toHaveClass('bg-red-900/50')
  })
})

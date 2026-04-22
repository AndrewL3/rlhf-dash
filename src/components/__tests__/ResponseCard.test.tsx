import { render, screen } from '@testing-library/react'
import { ResponseCard } from '../ResponseCard'

describe('ResponseCard', () => {
  it('renders response text', () => {
    render(<ResponseCard text="The answer is 42." label="Left" />)
    expect(screen.getByText('The answer is 42.')).toBeInTheDocument()
  })

  it('renders the side label', () => {
    render(<ResponseCard text="Some response" label="Right" />)
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('uses monospace font for response text', () => {
    render(<ResponseCard text="Code output" label="Left" />)
    const textEl = screen.getByText('Code output')
    expect(textEl).toHaveClass('font-mono')
  })
})

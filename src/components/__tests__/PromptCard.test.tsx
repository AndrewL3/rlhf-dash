import { render, screen } from '@testing-library/react'
import { PromptCard } from '../PromptCard'

describe('PromptCard', () => {
  it('renders prompt text', () => {
    render(<PromptCard text="Explain quantum computing" domain="science" />)
    expect(screen.getByText('Explain quantum computing')).toBeInTheDocument()
  })

  it('renders domain badge', () => {
    render(<PromptCard text="Write a haiku" domain="creative_writing" />)
    expect(screen.getByText('creative_writing')).toBeInTheDocument()
  })
})

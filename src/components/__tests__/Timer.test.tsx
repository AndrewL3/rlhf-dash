import { render, screen } from '@testing-library/react'
import { Timer } from '../Timer'

describe('Timer', () => {
  it('formats zero milliseconds as 00:00', () => {
    render(<Timer timeElapsed={0} />)
    expect(screen.getByText('00:00')).toBeInTheDocument()
  })

  it('formats milliseconds as mm:ss', () => {
    render(<Timer timeElapsed={125000} />)
    expect(screen.getByText('02:05')).toBeInTheDocument()
  })

  it('handles times over an hour', () => {
    render(<Timer timeElapsed={3661000} />)
    expect(screen.getByText('61:01')).toBeInTheDocument()
  })
})

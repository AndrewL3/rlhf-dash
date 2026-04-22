import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../ProgressBar'

describe('ProgressBar', () => {
  it('renders completed and total count', () => {
    render(<ProgressBar completed={5} total={30} />)
    expect(screen.getByText('5 / 30')).toBeInTheDocument()
  })

  it('renders percentage', () => {
    render(<ProgressBar completed={15} total={30} />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('handles zero total without division error', () => {
    render(<ProgressBar completed={0} total={0} />)
    expect(screen.getByText('0 / 0')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})

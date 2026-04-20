import { renderHook, act } from '@testing-library/react'
import { useTimer } from '../useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at 0', () => {
    const { result } = renderHook(() => useTimer())
    expect(result.current.timeElapsed).toBe(0)
  })

  it('updates every second', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.timeElapsed).toBeGreaterThanOrEqual(3000)
  })

  it('resets to 0', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    act(() => {
      result.current.reset()
    })

    expect(result.current.timeElapsed).toBe(0)
  })

  it('pauses and stops updating', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    act(() => {
      result.current.pause()
    })

    const pausedTime = result.current.timeElapsed

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.timeElapsed).toBe(pausedTime)
  })

  it('getElapsed returns precise ms', () => {
    const { result } = renderHook(() => useTimer())

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    const elapsed = result.current.getElapsed()
    expect(elapsed).toBeGreaterThanOrEqual(1500)
  })
})

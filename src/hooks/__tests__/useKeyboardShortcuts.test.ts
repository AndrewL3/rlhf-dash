import { renderHook } from '@testing-library/react'
import { useKeyboardShortcuts } from '../useKeyboardShortcuts'

describe('useKeyboardShortcuts', () => {
  it('calls handler when matching key is pressed', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts({ '1': handler }))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))

    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not call handler for non-matching keys', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts({ '1': handler }))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }))

    expect(handler).not.toHaveBeenCalled()
  })

  it('handles ctrl+z modifier', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts({ 'ctrl+z': handler }))

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'z', ctrlKey: true })
    )

    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not fire ctrl+z without modifier', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts({ 'ctrl+z': handler }))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))

    expect(handler).not.toHaveBeenCalled()
  })

  it('handles Enter key', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboardShortcuts({ Enter: handler }))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))

    expect(handler).toHaveBeenCalledOnce()
  })

  it('cleans up listeners on unmount', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts({ '1': handler })
    )

    unmount()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))

    expect(handler).not.toHaveBeenCalled()
  })
})

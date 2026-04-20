import { useEffect } from 'react'

export function useKeyboardShortcuts(
  handlers: Record<string, () => void>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modifiers: string[] = []
      if (e.ctrlKey || e.metaKey) modifiers.push('ctrl')
      if (e.shiftKey) modifiers.push('shift')
      if (e.altKey) modifiers.push('alt')

      const key = modifiers.length
        ? `${modifiers.join('+')}+${e.key.toLowerCase()}`
        : e.key

      const handler = handlers[key]
      if (handler) {
        e.preventDefault()
        handler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlers])
}

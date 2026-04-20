import { useState, useRef, useEffect, useCallback } from 'react'

export function useTimer() {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const startRef = useRef(Date.now())
  const pausedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setTimeElapsed(Date.now() - startRef.current)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const reset = useCallback(() => {
    startRef.current = Date.now()
    pausedRef.current = false
    setTimeElapsed(0)
  }, [])

  const pause = useCallback(() => {
    pausedRef.current = true
  }, [])

  const getElapsed = useCallback(() => {
    return Date.now() - startRef.current
  }, [])

  return { timeElapsed, reset, pause, getElapsed }
}

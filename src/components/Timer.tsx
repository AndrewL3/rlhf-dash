interface TimerProps {
  timeElapsed: number
}

export function Timer({ timeElapsed }: TimerProps) {
  const minutes = Math.floor(timeElapsed / 60000)
  const seconds = Math.floor((timeElapsed % 60000) / 1000)
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <div className="text-sm text-gray-400 font-mono tabular-nums">
      {formatted}
    </div>
  )
}

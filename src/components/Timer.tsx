interface TimerProps {
  timeElapsed: number
}

export function Timer({ timeElapsed }: TimerProps) {
  const minutes = Math.floor(timeElapsed / 60000)
  const seconds = Math.floor((timeElapsed % 60000) / 1000)
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const timerColor =
    timeElapsed >= 300000
      ? 'text-amber-400'
      : timeElapsed >= 180000
        ? 'text-amber-400/70'
        : 'text-gray-300'

  return (
    <div className="text-right shrink-0">
      <p className="text-[10px] uppercase tracking-widest text-gray-500">Time</p>
      <p className={`text-base font-mono tabular-nums transition-colors duration-1000 ${timerColor}`}>{formatted}</p>
    </div>
  )
}

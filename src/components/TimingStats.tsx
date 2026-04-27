import type { Annotation } from '../types'
import { timingStats } from '../lib/metrics'

interface TimingStatsProps {
  annotations: Annotation[]
}

function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function TimingStats({ annotations }: TimingStatsProps) {
  const stats = timingStats(annotations)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-400">Timing</h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500">Avg Time</p>
          <p className="text-lg font-mono tabular-nums text-gray-100">
            {formatTime(stats.avg)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Median Time</p>
          <p className="text-lg font-mono tabular-nums text-gray-100">
            {formatTime(stats.median)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Completed</p>
          <p className="text-lg font-mono tabular-nums text-gray-100">
            {stats.count}
          </p>
        </div>
      </div>
    </div>
  )
}

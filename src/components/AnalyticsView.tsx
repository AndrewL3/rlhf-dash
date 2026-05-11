import type { Annotation, Prompt } from '../types'
import { ScoreDistribution } from './ScoreDistribution'
import { WinRateChart } from './WinRateChart'
import { FlagBreakdown } from './FlagBreakdown'
import { TimingStats } from './TimingStats'

interface AnalyticsViewProps {
  annotations: Annotation[]
  prompts: Prompt[]
}

export function AnalyticsView({ annotations, prompts }: AnalyticsViewProps) {
  if (annotations.length === 0) {
    return (
      <div className="py-16 max-w-sm mx-auto">
        <p className="text-sm text-gray-400">
          Analytics populate as you annotate:
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-gray-500">
          <li>Score distributions across all four dimensions</li>
          <li>Win rates by model</li>
          <li>Flag frequency breakdown</li>
          <li>Timing stats (avg &amp; median per annotation)</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <ScoreDistribution annotations={annotations} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <WinRateChart annotations={annotations} prompts={prompts} />
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <FlagBreakdown annotations={annotations} />
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <TimingStats annotations={annotations} />
        </div>
      </div>
    </div>
  )
}

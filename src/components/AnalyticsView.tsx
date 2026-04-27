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
      <div className="text-center py-16">
        <p className="text-gray-500">
          Complete some annotations to see analytics.
        </p>
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

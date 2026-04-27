import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { Annotation, Dimension } from '../types'
import { DIMENSIONS } from '../types'
import { scoreDistribution } from '../lib/metrics'

interface ScoreDistributionProps {
  annotations: Annotation[]
}

const DIMENSION_LABELS: Record<Dimension, string> = {
  helpfulness: 'Helpfulness',
  safety: 'Safety',
  accuracy: 'Accuracy',
  coherence: 'Coherence',
}

export function ScoreDistribution({ annotations }: ScoreDistributionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-400">Score Distribution</h3>
      <div className="grid grid-cols-2 gap-4">
        {DIMENSIONS.map((dimension) => {
          const data = scoreDistribution(annotations, dimension)
          return (
            <div key={dimension}>
              <p className="text-xs text-gray-500 mb-2">
                {DIMENSION_LABELS[dimension]}
              </p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="score"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#374151' }}
                    tickLine={{ stroke: '#374151' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#374151' }}
                    tickLine={{ stroke: '#374151' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: 'none',
                      borderRadius: '0.375rem',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}

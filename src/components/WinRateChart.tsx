import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { Annotation, Prompt } from '../types'
import { winRates } from '../lib/metrics'

interface WinRateChartProps {
  annotations: Annotation[]
  prompts: Prompt[]
}

export function WinRateChart({ annotations, prompts }: WinRateChartProps) {
  const data = winRates(annotations, prompts)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-400">Wins</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-600">No win data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis
              dataKey="model"
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
            <Bar dataKey="wins" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

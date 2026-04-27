import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { Annotation } from '../types'
import { flagCounts } from '../lib/metrics'

interface FlagBreakdownProps {
  annotations: Annotation[]
}

function formatFlagLabel(flag: string): string {
  return flag
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function FlagBreakdown({ annotations }: FlagBreakdownProps) {
  const data = flagCounts(annotations).map((d) => ({
    ...d,
    label: formatFlagLabel(d.flag),
  }))

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-400">Flags</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
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
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 2, 2, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

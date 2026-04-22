interface ResponseCardProps {
  text: string
  label: string
}

export function ResponseCard({ text, label }: ResponseCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <p className="mt-2 font-mono text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
        {text}
      </p>
    </div>
  )
}

interface PromptCardProps {
  text: string
  domain: string
}

export function PromptCard({ text, domain }: PromptCardProps) {
  return (
    <div className="border-l-2 border-gray-700 pl-4 py-1">
      <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-gray-800 text-gray-300 mb-3">
        {domain}
      </span>
      <p className="text-gray-100 leading-relaxed">{text}</p>
    </div>
  )
}

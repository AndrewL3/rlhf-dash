import type { Annotation, Prompt } from '../types'

export function toJSONL(annotations: Annotation[], prompts: Prompt[]): string {
  const promptMap = new Map(prompts.map((p) => [p.id, p]))

  return annotations
    .filter((a) => a.winner !== 'tie')
    .map((a) => {
      const prompt = promptMap.get(a.promptId)!
      const responseMap = new Map(prompt.responses.map((r) => [r.id, r]))

      const [leftId, rightId] = a.displayOrder
      const leftResponse = responseMap.get(leftId)!
      const rightResponse = responseMap.get(rightId)!

      const chosen = a.winner === 'a' ? leftResponse : rightResponse
      const rejected = a.winner === 'a' ? rightResponse : leftResponse

      return JSON.stringify({
        prompt: prompt.text,
        chosen: chosen.text,
        rejected: rejected.text,
        metadata: {
          promptId: a.promptId,
          chosenId: chosen.id,
          rejectedId: rejected.id,
          scores: a.scores,
          flags: a.flags,
          timeSpentMs: a.timeSpentMs,
          timestamp: a.timestamp,
          displayOrder: a.displayOrder,
        },
      })
    })
    .join('\n')
}

export function downloadJSONL(content: string, filename?: string): void {
  const blob = new Blob([content], { type: 'application/jsonl' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename ?? `annotations-${new Date().toISOString().split('T')[0]}.jsonl`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

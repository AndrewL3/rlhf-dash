import type { Annotation, Dimension, FlagType, Prompt } from '../types'
import { FLAG_TYPES } from '../types'

export function scoreDistribution(
  annotations: Annotation[],
  dimension: Dimension
): { score: number; count: number }[] {
  const counts = [0, 0, 0, 0, 0]

  for (const annotation of annotations) {
    for (const responseScores of Object.values(annotation.scores)) {
      const value = responseScores[dimension]
      if (value >= 1 && value <= 5) {
        counts[value - 1]++
      }
    }
  }

  return counts.map((count, i) => ({ score: i + 1, count }))
}

export function winRates(
  annotations: Annotation[],
  prompts: Prompt[]
): { model: string; wins: number; total: number }[] {
  const nonTies = annotations.filter((a) => a.winner !== 'tie')
  if (nonTies.length === 0) return []

  const promptMap = new Map(prompts.map((p) => [p.id, p]))
  const wins: Record<string, number> = {}
  const totals: Record<string, number> = {}

  for (const a of nonTies) {
    const prompt = promptMap.get(a.promptId)!
    const responseMap = new Map(prompt.responses.map((r) => [r.id, r]))

    const [leftId, rightId] = a.displayOrder
    const winnerId = a.winner === 'a' ? leftId : rightId
    const loserId = a.winner === 'a' ? rightId : leftId

    const winnerModel = responseMap.get(winnerId)!.model
    const loserModel = responseMap.get(loserId)!.model

    wins[winnerModel] = (wins[winnerModel] ?? 0) + 1
    totals[winnerModel] = (totals[winnerModel] ?? 0) + 1
    totals[loserModel] = (totals[loserModel] ?? 0) + 1
  }

  const models = new Set([...Object.keys(wins), ...Object.keys(totals)])
  return Array.from(models).map((model) => ({
    model,
    wins: wins[model] ?? 0,
    total: totals[model] ?? 0,
  }))
}

export function flagCounts(
  annotations: Annotation[]
): { flag: FlagType; count: number }[] {
  const counts: Record<FlagType, number> = {
    hallucination: 0,
    harmful: 0,
    refusal_failure: 0,
    pii_leak: 0,
  }

  for (const annotation of annotations) {
    for (const flags of Object.values(annotation.flags)) {
      for (const flag of flags) {
        counts[flag]++
      }
    }
  }

  return FLAG_TYPES.map((flag) => ({ flag, count: counts[flag] }))
}

export function timingStats(
  annotations: Annotation[]
): { avg: number; median: number; count: number } {
  if (annotations.length === 0) return { avg: 0, median: 0, count: 0 }

  const times = annotations.map((a) => a.timeSpentMs).sort((a, b) => a - b)
  const sum = times.reduce((a, b) => a + b, 0)
  const mid = Math.floor(times.length / 2)
  const median =
    times.length % 2 === 0
      ? (times[mid - 1] + times[mid]) / 2
      : times[mid]

  return {
    avg: Math.round(sum / times.length),
    median,
    count: times.length,
  }
}

export interface Prompt {
  id: string
  text: string
  domain: string
  responses: Response[]
}

export interface Response {
  id: string
  model: string
  text: string
}

export interface Annotation {
  promptId: string
  responseAId: string
  responseBId: string
  displayOrder: [string, string]
  winner: Winner
  scores: Record<string, DimensionScores>
  flags: Record<string, FlagType[]>
  timeSpentMs: number
  timestamp: string
}

export interface DimensionScores {
  helpfulness: number
  safety: number
  accuracy: number
  coherence: number
}

export type FlagType = 'hallucination' | 'harmful' | 'refusal_failure' | 'pii_leak'

export type Winner = 'a' | 'b' | 'tie'

export type Dimension = keyof DimensionScores

export type ActiveView = 'rating' | 'analytics'

export const DIMENSIONS: Dimension[] = ['helpfulness', 'safety', 'accuracy', 'coherence']

export const FLAG_TYPES: FlagType[] = ['hallucination', 'harmful', 'refusal_failure', 'pii_leak']

export const DEFAULT_SCORES: DimensionScores = {
  helpfulness: 0,
  safety: 0,
  accuracy: 0,
  coherence: 0,
}

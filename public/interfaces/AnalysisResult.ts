export interface Score {
    label: string
    score: number
}

export interface AnalysisResult {
    sentiment?: string
    confidence?: number
    scores?: Score[]
    error?: string
}
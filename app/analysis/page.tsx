'use client'

import { AnalysisResult } from '@/public/interfaces/AnalysisResult'
import { useState } from 'react'

export default function AnalysisPage() {
    const [text, setText] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [result, setResult] = useState<AnalysisResult | null>(null)

    const analyzeText = async () => {
        setIsLoading(true)
        setResult(null)

        try {
            const res = await fetch('/api/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(errorText || 'Erro na requisição')
            }

            const data = await res.json()
            setResult(data)
        } catch (error) {
            console.error("Erro na análise:", error)
            setResult({
                error: error instanceof Error ? error.message : "Falha ao analisar o texto"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const translateSentiment = (sentiment: string) => {
        const translations: Record<string, string> = {
            POS: 'Positivo',
            NEG: 'Negativo',
            NEU: 'Neutro'
        }
        return translations[sentiment.toUpperCase()] || sentiment
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Análise de Texto</h2>
            <textarea
                className="w-full text-black p-2 border rounded"
                rows={6}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite seu texto aqui..."
            />
            <button
                onClick={analyzeText}
                className={`mt-2 px-4 py-2 rounded text-white ${isLoading ? 'bg-gray-500' : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                disabled={!text.trim() || isLoading}
            >
                {isLoading ? 'Analisando...' : 'Analisar'}
            </button>

            {result && (
                <div className="mt-4 bg-gray-700 p-4 rounded text-white">
                    {result.error ? (
                        <div className="text-red-400">
                            <p className="font-bold">Erro:</p>
                            <p>{result.error}</p>
                            <p className="mt-2 text-sm">Dica: Tente textos mais curtos ou específicos.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-bold mb-2">Resultado:</h3>
                            <div className="space-y-2">
                                <p>
                                    <strong>Sentimento:</strong> {translateSentiment(result.sentiment || '')}
                                </p>
                                <p>
                                    <strong>Confiança:</strong> {result.confidence ?
                                        `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
                                </p>

                                <div className="mt-4">
                                    <p className="font-semibold">Detalhamento:</p>
                                    <ul className="mt-2 space-y-1">
                                        {result.scores?.map((score) => (
                                            <li key={score.label}>
                                                <span className="inline-block w-20 font-medium">{translateSentiment(score.label)}:</span>
                                                {(score.score * 100).toFixed(1)}%
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

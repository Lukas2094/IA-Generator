'use client'

import { AnalysisResult } from '@/public/interfaces/AnalysisResult'
import { useState } from 'react'
import { BiAnalyse } from 'react-icons/bi'
import { ImSpinner2 } from 'react-icons/im'

export default function Analysis() {
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
        <div className="max-w-2xl mx-auto p-6 bg-white text-gray-800 rounded-xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold text-center text-purple-800 flex items-center justify-center gap-2">
                <BiAnalyse size={24} />
                Análise de Texto com IA
            </h1>

            <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none min-h-[120px]"
                placeholder="Cole ou digite o texto para análise de sentimento..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            <button
                onClick={analyzeText}
                disabled={!text.trim() || isLoading}
                className="w-full flex items-center justify-center gap-2 bg-purple-700 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition disabled:opacity-50"
            >
                {isLoading ? (
                    <>
                        <ImSpinner2 className="animate-spin" />
                        Analisando...
                    </>
                ) : (
                    <>
                        <BiAnalyse />
                        Analisar Texto
                    </>
                )}
            </button>

            {result && (
                <div className="mt-6 bg-purple-100 border border-purple-300 text-purple-900 rounded-lg p-4 space-y-2">
                    {result.error ? (
                        <div className="text-red-600">
                            <p className="font-bold">Erro:</p>
                            <p>{result.error}</p>
                            <p className="mt-2 text-sm">💡 Dica: Tente textos mais curtos ou com linguagem mais clara.</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold">Resultado da Análise:</h2>
                            <p>
                                <strong>Sentimento:</strong> {translateSentiment(result.sentiment || '')}
                            </p>
                            <p>
                                <strong>Confiança:</strong> {result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
                            </p>

                            <div className="mt-4">
                                <p className="font-medium">Detalhamento:</p>
                                <ul className="mt-2 space-y-1 text-sm">
                                    {result.scores?.map((score) => (
                                        <li key={score.label} className="flex justify-between">
                                            <span>{translateSentiment(score.label)}:</span>
                                            <span>{(score.score * 100).toFixed(1)}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
};
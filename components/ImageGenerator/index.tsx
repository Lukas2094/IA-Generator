'use client'

import { useState } from 'react'
import { MdImage } from 'react-icons/md'
import { ImSpinner2 } from 'react-icons/im'

export default function ImageGen() {
    const [prompt, setPrompt] = useState('')
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function generate() {
        setError('')
        setLoading(true)
        setImage('')

        try {
            const res = await fetch('/api/image-gen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Erro desconhecido')
            } else {
                setImage(data.image)
            }
        } catch {
            setError('Erro ao chamar API')
        }

        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white text-gray-800 rounded-xl shadow-md space-y-6">
            <h1 className="text-2xl font-bold text-center text-blue-800 flex items-center justify-center gap-2">
                <MdImage size={28} />
                Gerador de Imagens com IA
            </h1>

            <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
                placeholder="Descreva o que deseja gerar como imagem (ex: 'uma floresta mágica ao pôr do sol')"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
            />

            <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
                {loading ? (
                    <>
                        <ImSpinner2 className="animate-spin" />
                        Gerando...
                    </>
                ) : (
                    <>
                        <MdImage />
                        Gerar Imagem
                    </>
                )}
            </button>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            {image && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold text-center mb-2">Imagem Gerada:</h2>
                    <img
                        src={image}
                        alt="Imagem gerada pela IA"
                        className="w-full rounded-lg shadow-lg border"
                    />
                </div>
            )}
        </div>
    )
};
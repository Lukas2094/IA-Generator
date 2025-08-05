'use client'

import { useState } from 'react'

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
        <div className="p-4 max-w-lg mx-auto">
            <textarea
                className="w-full border rounded p-2"
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Digite o prompt da imagem"
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                onClick={generate}
                disabled={loading || !prompt.trim()}
            >
                {loading ? 'Gerando...' : 'Gerar Imagem'}
            </button>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            {image && (
                <img
                    src={image}
                    alt="Imagem gerada"
                    className="mt-4 rounded shadow-md border"
                />
            )}
        </div>
    )
}

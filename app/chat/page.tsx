'use client'

import { useEffect, useRef, useState } from 'react'

export default function ChatPage() {
    const [messages, setMessages] = useState<{ role: string, content: string }[]>([])
    const [input, setInput] = useState('')
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const sendMessage = async () => {
        if (!input.trim()) return

        const updatedMessages = [...messages, { role: 'user', content: input }]
        setMessages(updatedMessages)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: updatedMessages })
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Erro da API: ${res.status} - ${errorText}`);
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } catch (err: any) {
            setMessages(prev => [...prev, { role: 'assistant', content: `Erro: ${err.message}` }])
        } finally {
            setInput('')
        }
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-800">Chat com IA 🤖</h2>

                <div className="flex-1 overflow-y-auto max-h-[400px] space-y-2 pr-2">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-xl max-w-[75%] ${msg.role === 'user'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                <span className="block text-xs mb-1 font-semibold">
                                    {msg.role === 'user' ? '🧑 Você' : '🤖 IA'}
                                </span>
                                <div className="whitespace-pre-wrap leading-relaxed text-sm font-bold">
                                    {msg.content}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="flex space-x-2">
                    <input
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite uma pergunta..."
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    )
}

import { openaiDp } from '@/lib/openai'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
        }

        const chat = await openaiDp.chat.completions.create({
            model: 'deepseek/deepseek-chat-v3-0324',
            messages: messages,
            max_tokens: 1000,
        });

        return NextResponse.json({ response: chat.choices[0].message.content });
    } catch (error: any) {
        console.error('Erro na API /chat:', error);
        return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
    }
}

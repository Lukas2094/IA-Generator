import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        const HF_TOKEN = process.env.HF_API_TOKEN;

        if (!HF_TOKEN) {
            throw new Error('Token HuggingFace não definido no ambiente');
        }

        if (!text || text.trim() === '') {
            return NextResponse.json(
                { error: 'Texto é obrigatório' },
                { status: 400 }
            );
        }

        const MODEL_NAME = 'finiteautomata/bertweet-base-sentiment-analysis';

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(
            `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${HF_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: text,
                    options: { wait_for_model: true }
                }),
                signal: controller.signal
            }
        );
        clearTimeout(timeout);

        const responseText = await response.text();
        let result;
        try {
            result = JSON.parse(responseText);
        } catch {
            console.error('Resposta não é JSON:', responseText);
            throw new Error(`Resposta inválida da API: ${responseText}`);
        }

        if (!Array.isArray(result) || result.length === 0) {
            throw new Error('Resposta inesperada da API');
        }

        const bestMatch = result[0].reduce((prev: any, current: any) =>
            (prev.score > current.score) ? prev : current
        );

        return NextResponse.json({
            sentiment: bestMatch.label || 'neutral',
            confidence: bestMatch.score || 0,
            scores: result[0]
        });

    } catch (error: any) {
        console.error('Erro completo:', error);
        return NextResponse.json(
            {
                error: 'Falha na análise',
                details: error.message,
                solution: 'Verifique se o texto e o token estão corretos'
            },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const { prompt } = await req.json();

    if (!prompt || prompt.trim() === '') {
        return NextResponse.json({ error: 'Prompt é obrigatório' }, { status: 400 });
    }

    try {
        const HF_API_TOKEN = process.env.HF_API_TOKEN;
        if (!HF_API_TOKEN) {
            throw new Error('Token HF_API_TOKEN não configurado');
        }

        const model = 'stabilityai/stable-diffusion-xl-base-1.0';

        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${HF_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                options: {
                    wait_for_model: true
                }
            }),
        });

        console.log('Status da resposta:', response.status); 

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro na Hugging Face API:', errorText);
            return NextResponse.json({ error: 'Erro na API Hugging Face', details: errorText }, { status: response.status });
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('image')) {
            const responseBody = await response.text();
            console.log('Resposta inesperada:', responseBody);
            return NextResponse.json({ error: 'Resposta não é uma imagem', details: responseBody }, { status: 500 });
        }

        const imageBuffer = await response.arrayBuffer();
        const base64Image = Buffer.from(imageBuffer).toString('base64');

        return NextResponse.json({
            image: `data:image/png;base64,${base64Image}`,
            model: model
        });
    } catch (err: any) {
        console.error('Erro ao gerar imagem:', err.message || err);
        return NextResponse.json({
            error: 'Erro ao gerar imagem',
            details: err.message
        }, { status: 500 });
    }
}
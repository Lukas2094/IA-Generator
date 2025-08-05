import OpenAI from 'openai';

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


export const openaiDp = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY!,
    baseURL: 'https://openrouter.ai/api/v1', // <- muda o baseURL
    defaultHeaders: {
        'HTTP-Referer': 'http://localhost:3000', // ou sua URL
        'X-Title': 'Projeto IA com DeepSeek',
    },
});
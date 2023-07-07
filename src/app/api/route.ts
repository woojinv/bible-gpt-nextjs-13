import { NextRequest, NextResponse } from 'next/server';

import { OpenAIStream } from '@/utils/OpenAIStream';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
}

export const runtime = 'edge';

// interfaces
export type ChatGPTAgent = 'user' | 'system';

export interface chatGPTMessage {
    role: ChatGPTAgent;
    content: string;
}

export interface OpenAIStreamPayload {
    model: string;
    messages: chatGPTMessage[];
    stream: boolean;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { passage, question } = await req.json();

    const messages: chatGPTMessage[] = [
        {
            role: 'system',
            content:
                'You are a bible study assistant. You will be given a reference to a passage in the bible, as well as a question to answer regarding that passage. You will provide a succint answer to the question. Your answer will be hermeneutic. You will provide the bible reference from which you devised your answer. You will use the ESV version to determine your answers and for any quotations and/or references you provide. You will NOT directly re-quote the passage that was provided, as this would be redundant.',
        },
        {
            role: 'user',
            content: `
        passage: ${passage}
        question: ${question}
        `,
        },
    ];

    const payload: OpenAIStreamPayload = {
        model: 'gpt-4',
        messages,
        stream: true,
    };
    const stream = await OpenAIStream(payload);
    return new NextResponse(stream);
}

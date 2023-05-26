import { NextRequest, NextResponse } from 'next/server';
import { OpenAIStream, OpenAIStreamPayload, chatGPTMessage } from '@/utils/OpenAIStream';

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing env var from OpenAI');
}

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { passage, question } = await req.json();
    console.log(passage, '<<< passage');
    console.log(question, '<<< question');

    const messages: chatGPTMessage[] = [
        {
            role: 'system',
            content:
                'You are a bible study assistant. You will be given a reference to a passage in the bible, as well as a question to answer regarding that passage. You will provide a succint answer to the question. Your answer will be hermeneutic. You will provide the bible reference from which you devised your answer.',
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
        model: 'gpt-3.5-turbo',
        messages,
        stream: true,
    };

    const stream = await OpenAIStream(payload);
    return new NextResponse(stream);
}

import { NextRequest } from 'next/server';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';

import { sql } from '@vercel/postgres';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export const runtime = 'edge';

// interfaces
export type ChatGPTAgent = 'user' | 'system';

export interface chatGPTMessage {
    role: ChatGPTAgent;
    content: string;
}

export async function POST(req: NextRequest): Promise<StreamingTextResponse> {
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

    const response: StreamingTextResponse = await openai.createChatCompletion({
        model: 'gpt-4',
        stream: true,
        messages,
    });

    let rowId = '';

    const stream = OpenAIStream(response, {
        onStart: async () => {
            rowId = await savePromptToDB(passage, question);
        },
        onCompletion: async (completion: string) => {
            await saveCompletionToDatabase(completion, rowId);
        },
    });

    return new StreamingTextResponse(stream);
}

const savePromptToDB = async (passage: string, question: string) => {
    const interactionResult = await sql`
        INSERT INTO interactions (passage, question)
        VALUES (${passage}, ${question})
        RETURNING id;
        `;

    const rowId = interactionResult.rows[0].id;

    return rowId;
};

const saveCompletionToDatabase = async (completion: string, rowId: string) => {
    await sql`
        UPDATE interactions
        SET answer = ${completion}
        WHERE id = ${rowId}    
    `;
};

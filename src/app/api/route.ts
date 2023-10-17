import { NextRequest, NextResponse } from 'next/server';
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
    try {
        const { passage, question } = await req.json();

        const messages: chatGPTMessage[] = [
            {
                role: 'system',
                content:
                    'You are a bible study assistant. You will be given a reference to a passage in the bible, as well as a question to answer regarding that passage. You will provide a succint answer to the question. Your answer will be hermeneutic. You will provide the bible reference from which you devised your answer. You will use the ESV version to determine your answers and for any quotations and/or references you provide. You will NOT directly re-quote the passage that was provided, as this would be redundant. Your answer will be at 6th grade reading level so as to not be too academic and/or intimidating for the average person.',
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
                if (process.env.NODE_ENV === 'development') return;
                if (question) {
                    rowId = await savePromptToDB(passage, question);
                }
            },
            onCompletion: async (completion: string) => {
                if (rowId) {
                    await saveCompletionToDatabase(completion, rowId);
                }
            },
        });

        return new StreamingTextResponse(stream);
    } catch (err) {
        console.error();
        return NextResponse.error();
    }
}

const savePromptToDB = async (passage: string, question: string) => {
    try {
        const interactionResult = await sql`
        INSERT INTO interactions (passage, question)
        VALUES (${passage}, ${question})
        RETURNING id;
        `;

        const rowId = interactionResult.rows[0].id;

        return rowId;
    } catch (err) {
        console.error(err);
        throw new Error('Error in savePromptToDB()');
    }
};

const saveCompletionToDatabase = async (completion: string, rowId: string) => {
    try {
        await sql`
        UPDATE interactions
        SET answer = ${completion}
        WHERE id = ${rowId}    
    `;
    } catch (err) {
        console.error(err);
        throw new Error('Error in saveCompletionToDatabase()');
    }
};

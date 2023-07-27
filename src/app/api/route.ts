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

    const stream = OpenAIStream(response, {
        onStart: async () => {
            console.log('start stream');
            await savePromptToDB(passage, question);
        },
        onCompletion: async (completion: string) => {
            console.log('stop stream');
            await saveCompletionToDatabase(completion);
        },
    });

    return new StreamingTextResponse(stream);
}

const savePromptToDB = async (passage: string, question: string) => {
    console.log(passage, '<<< passage');
    console.log(question, '<<< question');
    // const interactionId = await sql`
    //     INSERT INTO interactions (passage, question)
    //     VALUES (${passage}, ${question})
    //     RETURNING id;
    //     `;

    // console.log(interactionId, '<<< interactionId');
};

const saveCompletionToDatabase = async (completion: string) => {
    console.log(completion, '<<< completion');
};

import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
    if (!configuration.apiKey) {
        return NextResponse.json({
            error: {
                message: 'OpenAI API key not configured.',
            },
        });
    }
    console.log(req.body, '<<< req.body');
    console.log('hit');
}

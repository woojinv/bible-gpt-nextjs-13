import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';
import { Configuration, OpenAIApi } from 'openai';

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

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function OpenAIStream(payload: OpenAIStreamPayload) {
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    let counter = 0;

    const completion = await openai.createChatCompletion(payload);

    const stream = new ReadableStream({
        async start(controller) {
            function onParse(event: ParsedEvent | ReconnectInterval) {
                if (event.type === 'event') {
                    const data = event.data;
                    if (data === '[DONE]') {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        console.log(json, '<<< json');
                        const text = json.choices[0].delta?.content || '';

                        if (counter < 2 && (text.match(/\n/) || []).length) {
                            // this is a prefix character (i.e., "\n\n"), do nothing
                            return;
                        }
                        console.log(text, '<<< text');
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                        counter++;
                    } catch (err) {
                        controller.error(err);
                    }
                }
            }

            // stream response (SSE) from OpenAI may be fragmented into multiple chunks
            // this ensures we properly read chunks and invoke an event for each SSE event stream
            const parser = createParser(onParse);
            // https://web.dev/streams/#asynchronous-iteration
            for await (const chunk of completion.data as any) {
                parser.feed(chunk);
            }
        },
    });

    return stream;
}

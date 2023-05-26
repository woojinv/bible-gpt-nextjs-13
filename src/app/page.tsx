'use client';

import { useState } from 'react';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [passageInput, setPassageInput] = useState('');
    const [questionInput, setQuestionInput] = useState('');
    const [answer, setAnswer] = useState('');

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
        setAnswer('');
        setLoading(true);
        try {
            const response = await fetch('/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passage: passageInput,
                    question: questionInput,
                }),
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const data = response.body;
            if (!data) return;

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                console.log(chunkValue, '<<< chunkValue');
                setAnswer((prev) => prev + chunkValue);
            }

            setLoading(false);
        } catch (err) {}
    }

    return (
        <main>
            <div className="flex flex-col items-center my-12">
                <h1 className="text-5xl">BibleGPT</h1>
                <form onSubmit={handleSubmit} className="text-center my-4">
                    <input
                        required
                        type="text"
                        name="passage"
                        placeholder="Enter a Passage"
                        value={passageInput}
                        className="text-black block mb-2"
                        onChange={(e) => {
                            setPassageInput(e.target.value);
                        }}
                    />
                    <input
                        required
                        type="text"
                        name="question"
                        placeholder="Enter a question"
                        value={questionInput}
                        className="text-black block"
                        onChange={(e) => {
                            setQuestionInput(e.target.value);
                        }}
                    />
                    <input type="submit" value="Submit" />
                </form>
                <p>
                    {answer}
                    {loading && '...'}
                </p>
            </div>
        </main>
    );
}

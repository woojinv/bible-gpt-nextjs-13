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
                setAnswer((prev) => prev + chunkValue);
            }

            setLoading(false);
        } catch (err) {}
    }

    return (
        <main className="text-center px-5 bg-slate-800 h-screen">
            <div className="prose sticky top-0 h-72 bg-slate-800 pt-10">
                <h1>BibleGPT</h1>
                <form onSubmit={handleSubmit} className="">
                    <input
                        required
                        type="text"
                        name="passage"
                        placeholder="Enter a Passage"
                        value={passageInput}
                        className="input input-bordered w-full max-w-xs mb-3 text-center"
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
                        className="input input-bordered w-full max-w-xs mb-3 text-center"
                        onChange={(e) => {
                            setQuestionInput(e.target.value);
                        }}
                    />
                    <input type="submit" value="Submit" className="btn" />
                </form>
            </div>

            <div className="">
                <p className="mt-2">
                    {answer}
                    {loading && '...'}
                </p>
            </div>
        </main>
    );
}

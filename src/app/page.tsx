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
        <main className="h-screen overflow-y-scroll bg-slate-800 px-5 text-center">
            <div className="mx-auto max-w-xs">
                <h1 className="mb-5 mt-10 text-5xl text-slate-200">BibleGPT</h1>
                <form onSubmit={handleSubmit} className="mb-5 flex flex-col items-center">
                    <input
                        required
                        type="text"
                        name="passage"
                        placeholder="Enter a Passage"
                        value={passageInput}
                        className="input-bordered input-accent input mb-3 w-full max-w-xs text-center"
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
                        className="input-bordered input-accent input mb-3 w-full max-w-xs text-center"
                        onChange={(e) => {
                            setQuestionInput(e.target.value);
                        }}
                    />
                    <input type="submit" value="Submit" className="btn-accent btn" />
                </form>

                <div>
                    <p className="text-slate-400">
                        {answer}
                        {loading && '▋'}
                    </p>
                </div>
            </div>
        </main>
    );
}

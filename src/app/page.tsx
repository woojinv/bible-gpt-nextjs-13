'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
    const passageInputRef = useRef<HTMLInputElement | null>(null);
    const questionInputRef = useRef<HTMLInputElement | null>(null);
    const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

    const [loading, setLoading] = useState(false);
    const [passageInput, setPassageInput] = useState('');
    const [questionInput, setQuestionInput] = useState('');
    const [answer, setAnswer] = useState('');

    const stopStream = () => {
        if (readerRef.current) {
            readerRef.current.cancel();
            setLoading(false);
        }
    };

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
            readerRef.current = reader;
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

    useEffect(() => {
        passageInputRef.current?.focus();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-slate-800">
            <main className="mb-auto overflow-y-scroll px-5 text-center">
                <div className="mx-auto max-w-lg px-3">
                    <h1 className="mb-5 mt-10 text-5xl text-slate-200">BibleGPT</h1>
                    <form onSubmit={handleSubmit} className="mb-5 flex flex-col items-center">
                        <input
                            ref={passageInputRef}
                            type="text"
                            name="passage"
                            placeholder="Enter a Passage"
                            value={passageInput}
                            className="input-bordered input-accent input mb-3 w-full text-center"
                            onChange={(e) => {
                                setPassageInput(e.target.value);
                            }}
                        />
                        <input
                            required
                            ref={questionInputRef}
                            type="text"
                            name="question"
                            placeholder="Enter a Question"
                            value={questionInput}
                            className="input-bordered input-accent input mb-3 w-full text-center"
                            onChange={(e) => {
                                setQuestionInput(e.target.value);
                            }}
                        />
                        <div className="">
                            <input
                                type="button"
                                value="Clear Question"
                                className="btn-neutral btn mr-4"
                                onClick={() => {
                                    setQuestionInput('');
                                    questionInputRef.current?.focus();
                                }}
                            />
                            {!loading ? (
                                <input type="submit" value="Ask" className="btn-accent btn" disabled={loading} />
                            ) : (
                                <button onClick={stopStream} className="btn-secondary btn">
                                    Stop Loading
                                </button>
                            )}
                        </div>
                    </form>

                    <div>
                        <p className="text-slate-400">
                            {answer}
                            {loading && '▋'}
                        </p>
                    </div>
                </div>
            </main>
            <footer className=" bg-slate-800">
                <div className="flex justify-center pb-5 pt-3">
                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeIWdJ1q1idLvdwIwoNVoFCkPtPo9EdKVwBhyMhREX_FlxuzQ/viewform?usp=sf_link" target="_blank" className="text-slate-300">
                        Submit Feedback / Report Bug
                    </Link>
                </div>
            </footer>
        </div>
    );
}

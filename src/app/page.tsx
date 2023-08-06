'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import bookOfPrayer from './../bookOfPrayer.json';

interface PrayerPassages {
    'First Psalm'?: string;
    'Second Psalm'?: string;
    'Old Testament'?: string;
    'New Testament'?: string;
    Gospel?: string;
}

function DailyVerse() {
    const [randomPassage, setRandomPassage] = useState('');

    const fetchPassage = async (passage: string) => {
        try {
            const response = await fetch(`https://api.esv.org/v3/passage/html/?q=${passage}`, {
                headers: {
                    Authorization: 'Token babc8a297a91a09361f8e665c8a57b2c31c196da',
                },
            });

            const result = await response.json();
            const html = result.passages[0];
            const parser = new DOMParser();

            const doc = parser.parseFromString(html, 'text/html');

            doc.querySelectorAll('a').forEach((link) => {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            });

            setRandomPassage(doc.body.innerHTML);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const PrayerPassagesTyped: PrayerPassages[] = bookOfPrayer as PrayerPassages[];
        const i = Math.floor(Math.random() * PrayerPassagesTyped.length);
        const prayerPassages = PrayerPassagesTyped[i];

        const passageCategories = Object.keys(prayerPassages) as (keyof PrayerPassages)[];
        const j = Math.floor(Math.random() * passageCategories.length);
        const passageCategory = passageCategories[j];

        const passage = prayerPassages[passageCategory];
        if (passage) {
            fetchPassage(passage);
        }
    }, []);

    return <div className="mb-10 text-slate-400" dangerouslySetInnerHTML={{ __html: randomPassage }} />;
}

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
        <div className="flex  flex-col bg-slate-800">
            <main className=" mb-auto min-h-screen overflow-y-scroll px-5 text-center">
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

                    {!answer && <DailyVerse />}
                    <div>
                        <p className="mb-10 text-slate-400">
                            {answer}
                            {loading && '▋'}
                        </p>
                    </div>
                </div>
            </main>

            <footer className="footer bg-base-200 p-10 text-base-content">
                <div>
                    <span className="footer-title">Contact</span>
                    <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeIWdJ1q1idLvdwIwoNVoFCkPtPo9EdKVwBhyMhREX_FlxuzQ/viewform?usp=sf_link" target="_blank" rel="noreferrer">
                        Report a Bug
                    </Link>
                    <Link href="mailto:oh.woojin95@gmail.com?subject=BibleGPT%20Feedback:%20" target="_blank" rel="noreferrer">
                        Provide Feedback
                    </Link>
                </div>
            </footer>
            <footer className="footer border-t border-base-300 bg-base-200 px-10 py-4 text-base-content">
                <div className="grid-flow-col items-center">
                    <p className="text-xs">BibleGPT is powered by artificial intelligence and is in no way intended to be understood as absolute truth.</p>
                </div>
                <div className="md:place-self-center md:justify-self-end">
                    <div className="grid grid-flow-col gap-4">
                        <Link href="https://github.com/woojinv/bible-gpt-nextjs-13" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 496 512" className="fill-current">
                                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                            </svg>
                        </Link>
                        <Link href="https://www.linkedin.com/in/woojin-oh/" target="_blank" rel="noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512" className="fill-current">
                                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

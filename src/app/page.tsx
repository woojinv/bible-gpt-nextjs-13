'use client';

import { useState } from 'react';

export default function Home() {
    const [passageInput, setPassageInput] = useState('');
    const [questionInput, setQuestionInput] = useState('');

    async function handleSubmit(e: { preventDefault: () => void }) {
        e.preventDefault();
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
            console.log(response, '<<< response');
        } catch (err) {}
    }

    return (
        <main>
            <div className="flex flex-col items-center my-12">
                <h1>BibleGPT</h1>
                <form onSubmit={handleSubmit} className="text-center">
                    <input
                        required
                        type="text"
                        name="passage"
                        placeholder="Enter a Passage"
                        value={passageInput}
                        className="text-black block"
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
            </div>
        </main>
    );
}

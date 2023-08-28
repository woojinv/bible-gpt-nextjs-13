'use client';

import { useEffect, useState } from 'react';

type Interaction = {
    id: string;
    question: string;
    passage: string;
    timestamp: string;
    answer: string;
};

export default function Feed() {
    const [interactions, setInteractions] = useState<Interaction[] | undefined>();

    async function fetchInteractions() {
        const res = await fetch('/interactions');
        const data: Interaction[] = await res.json();

        setInteractions(data);
    }

    useEffect(() => {
        fetchInteractions();
    }, []);

    if (!interactions) return <div>Loading</div>;

    return (
        <>
            <h1>Interactions</h1>
            {interactions.map((interaction) => (
                <div key={interaction.id} className="collapse bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl">
                        <p className="text-xl">{interaction.question}</p>
                        <p className="text-sm">Passage: {interaction.passage}</p>
                        <p className="text-xs">Date: {interaction.timestamp}</p>
                    </div>
                    <div className="collapse-content">
                        <p>{interaction.answer}</p>
                    </div>

                    <br />
                </div>
            ))}
        </>
    );
}

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
        try {
            const res = await fetch('/interactions', { cache: 'no-store' });

            if (!res.ok) {
                throw new Error('Error retrieving Interactions on the server');
            }

            const data: Interaction[] = await res.json();

            setInteractions(data);
        } catch (err) {
            console.error(err);
            window.alert('Error retrieving interactions. Please try again, or report this bug');
        }
    }

    useEffect(() => {
        fetchInteractions();
    }, []);

    if (!interactions) return <div className="bg-base-200">Loading</div>;

    return (
        <>
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

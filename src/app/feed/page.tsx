'use client';

import { useEffect, useState } from 'react';

export default function Feed() {
    const [interactions, setInteractions] = useState();

    async function fetchInteractions() {
        const res = await fetch('/interactions');
        const data = await res.json();
        console.log(data, '<<< data');
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

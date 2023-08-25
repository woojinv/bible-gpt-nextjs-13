import { sql } from '@vercel/postgres';

async function getInteractions() {
    // TODO: try/catch block
    const res = await sql`SELECT * FROM interactions ORDER BY timestamp DESC LIMIT 25`;
    const interactions = res.rows;

    interactions.forEach((interaction) => {
        interaction.timestamp = interaction.timestamp.toString();
    });

    return interactions;
}

export default async function Feed() {
    const interactions = await getInteractions();

    return (
        <>
            <h1>Interactions</h1>
            {interactions.map((interaction) => (
                <div key={interaction.id} className="collapse bg-base-200">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        <p>Passage: {interaction.passage}</p>
                        <p>Question: {interaction.question}</p>
                        <p>Date: {interaction.timestamp}</p>
                    </div>
                    <div className="collapse-content">
                        <p>Answer: {interaction.answer}</p>
                    </div>

                    <br />
                </div>
            ))}
        </>
    );
}

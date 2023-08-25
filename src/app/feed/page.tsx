import { sql } from '@vercel/postgres';

async function getInteractions() {
    console.log('hit getInteractions');
    const res = await sql`SELECT * FROM interactions`;
    console.log(res.rows, '<<< res. rows');
    const interactions = res.rows.sort((a, b) => b.timestamp - a.timestamp);
    return interactions;
}

export default async function Feed() {
    const interactions = await getInteractions();
    return (
        <>
            <h1>Interactions</h1>
            {interactions.map((interaction) => (
                <>
                    <br />
                    <div>Passage: {interaction.passage}</div>
                    <div>Question: {interaction.question}</div>
                    <div>Answer: {interaction.answer}</div>
                    <div>Date: {interaction.timestamp.toString()}</div>
                    <br />
                </>
            ))}
        </>
    );
}

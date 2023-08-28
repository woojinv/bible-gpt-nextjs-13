import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    // TODO: try/catch block
    const res = await sql`SELECT * FROM interactions ORDER BY timestamp DESC LIMIT 25`;
    const interactions = res.rows;

    interactions.forEach((interaction) => {
        interaction.timestamp = interaction.timestamp.toString();
    });

    console.log(interactions, '<<< interactions');

    return NextResponse.json(interactions);
}

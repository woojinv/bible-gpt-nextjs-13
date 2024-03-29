import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const res = await sql`SELECT * FROM interactions ORDER BY id DESC LIMIT 25`;
        const interactions = res.rows;

        interactions.forEach((interaction) => {
            interaction.timestamp = interaction.timestamp.toString();
        });

        return NextResponse.json(interactions);
    } catch (err) {
        console.error(err);
        return NextResponse.error();
    }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { reference: string } }) {
    try {
        const { reference } = context.params;

        const response = await fetch(`https://api.esv.org/v3/passage/html/?q=${reference}`, {
            headers: {
                Authorization: `Token ${process.env.ESV_API_KEY}`,
            },
        });

        const result = await response.json();
        const passageHtml = result.passages[0];

        return NextResponse.json(passageHtml);
    } catch (err) {
        console.log(err);
    }
}

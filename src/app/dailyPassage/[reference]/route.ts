import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): NextResponse {
    console.log('hit dailyPassage route');
    console.log(req.passage, '<<< req ');
    try {
        const response = await fetch(`https://api.esv.org/v3/passage/html/?q=${passage}`, {
            headers: {
                Authorization: `Token ${process.env.NEXT_PUBLIC_ESV_API_KEY}`,
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
}

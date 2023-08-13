import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { reference: string } }) {
    console.log('hit dailyPassage route');
    const { reference } = context.params;
    console.log(reference, '<<< reference');

    console.log(process.env.ESV_API_KEY, '<<< process.env.ESV_API_KEY');
    try {
        const response = await fetch(`https://api.esv.org/v3/passage/html/?q=${reference}`, {
            headers: {
                Authorization: `Token ${process.env.ESV_API_KEY}`,
            },
        });

        console.log(response, '<<< response');

        const result = await response.json();

        console.log(result, '<<< ');
        const html = result.passages[0];
        // const parser = new DOMParser();

        // const doc = parser.parseFromString(html, 'text/html');

        // doc.querySelectorAll('a').forEach((link) => {
        //     link.target = '_blank';
        //     link.rel = 'noopener noreferrer';
        // });

        // setRandomPassage(doc.body.innerHTML);
        return NextResponse.json(html);
    } catch (err) {
        console.log(err);
    }
}

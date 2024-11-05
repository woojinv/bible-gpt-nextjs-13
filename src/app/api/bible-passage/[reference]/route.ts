import { NextRequest, NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';

export async function GET(req: NextRequest, context: { params: { reference: string } }) {
  try {
    const { reference } = context.params;

    const response = await fetch(`https://api.esv.org/v3/passage/html/?q=${reference}&include-footnotes=false`, {
      headers: {
        Authorization: `Token ${process.env.ESV_API_KEY}`,
      },
    });

    const result = await response.json();

    const passageHtml = result.passages[0];

    const dom = new JSDOM(passageHtml);

    const document = dom.window.document;

    const mp3Link = document.querySelector('a.mp3link') as HTMLAnchorElement;
    if (mp3Link) {
      mp3Link.textContent = mp3Link.textContent + ' 🦻';
      mp3Link.style.whiteSpace = 'nowrap';
    }

    const links = document.querySelectorAll('a');
    links.forEach((link: { target: string; rel: string }) => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });

    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach((p) => {
      p.style.marginBottom = '16px';
    });

    const h2s = document.querySelectorAll('h2');
    h2s.forEach((h2) => {
      h2.style.fontSize = '26px';
    });

    return NextResponse.json(document.body.innerHTML);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}

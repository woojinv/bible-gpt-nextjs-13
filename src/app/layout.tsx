import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BibleGPT',
  description: 'Web app to make Bible reading easier.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

function GoogleAnalytics() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/next-script-for-ga */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-NJP8YE3Z5Y" />
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
                  window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-NJP8YE3Z5Y');
                  `,
        }}
      />
    </>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EIGEN',
  description: 'We see what you see.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0a] min-h-screen">{children}</body>
    </html>
  );
}

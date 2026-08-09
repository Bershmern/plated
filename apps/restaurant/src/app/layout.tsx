import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plated — Restaurant Console',
  description: 'Counter order feed, table tabs, and Manager controls for Plated',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-porcelain text-graphite antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

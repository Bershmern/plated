import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plated Ops — Platform Administration',
  description: 'Internal ops console for Plated team',
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

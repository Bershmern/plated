import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plated — Premium QR Table-Ordering SaaS for Restaurants',
  description: 'Elevate your restaurant dining experience with animated table-ordering & loginless recognition.',
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

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plated — Order at your table',
  description: 'Animated QR table-ordering experience',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
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

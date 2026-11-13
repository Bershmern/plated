import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import '@plated/ui/tokens.css';

export const metadata: Metadata = {
  title: 'Plated | Premium QR Table-Ordering SaaS for Restaurants',
  description: 'Elevate your restaurant dining experience with animated table-ordering & loginless recognition.',
  keywords: ['QR menu', 'table ordering', 'restaurant SaaS', 'Nigeria restaurants', 'digital menu', 'contactless ordering'],
  metadataBase: new URL('https://plated.com'),
  openGraph: {
    title: 'Plated | Premium QR Table-Ordering',
    description: 'Elevate your restaurant dining experience with animated table-ordering & loginless recognition.',
    url: 'https://plated.com',
    siteName: 'Plated',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Plated Table Ordering Preview',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plated | Premium QR Table-Ordering',
    description: 'Elevate your restaurant dining experience with animated table-ordering & loginless recognition.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
});

import { GlobalLayoutProvider } from '@/components/layout/GlobalLayoutProvider/GlobalLayoutProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="bg-surface-primary text-text-primary font-sans antialiased min-h-screen">
        <GlobalLayoutProvider>
          {children}
        </GlobalLayoutProvider>
      </body>
    </html>
  );
}

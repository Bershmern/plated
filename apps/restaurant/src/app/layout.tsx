import type { Metadata } from 'next';
import './globals.css';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: 'Plated — Restaurant Console',
  description: 'Counter order feed, table tabs, and Manager controls for Plated',
};

function getBrandConfig() {
  try {
    const configPath = path.join(process.cwd(), '../../brand.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch (e) {}
  return { primaryColor: '#EA580C', secondaryColor: '#FFEDD5', activeFont: 'Inter' };
}

function hexToHSL(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return `${h} ${s}% ${l}%`;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getBrandConfig();
  const primaryHsl = hexToHSL(config.primaryColor);
  
  const fontFamilyMap: Record<string, string> = {
    'Inter': 'var(--font-sans)',
    'Plus Jakarta Sans': '"Plus Jakarta Sans", sans-serif',
    'Outfit': '"Outfit", sans-serif',
    'Space Grotesk': '"Space Grotesk", sans-serif',
    'Playfair Display': '"Playfair Display", serif',
    'Cormorant Garamond': '"Cormorant Garamond", serif',
  };
  
  const selectedFont = fontFamilyMap[config.activeFont] || 'var(--font-sans)';

  return (
    <html lang="en" style={{
      '--action-primary': primaryHsl,
      '--action-primary-hover': primaryHsl,
      '--font-sans': selectedFont,
    } as React.CSSProperties}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@400;500;700;900&family=Playfair+Display:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface-primary text-text-primary antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'surface-dark': 'var(--surface-dark)',
        'surface-card': 'var(--surface-card)',
        'surface-hover': 'var(--surface-hover)',
        linen: 'var(--linen)',
        porcelain: 'var(--porcelain)',
        chalk: 'var(--chalk)',
        graphite: 'var(--graphite)',
        slate: 'var(--slate)',
        brass: '#3B82F6', // Brand Electric Blue accent
        ok: 'var(--ok)',
        alert: 'var(--alert)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          ink: 'var(--accent-ink)',
          wash: 'var(--accent-wash)',
          glow: 'var(--accent-glow)',
        },
      },
      transitionTimingFunction: {
        landing: 'var(--ease-landing)',
        'out-smooth': 'var(--ease-out-smooth)',
      },
      transitionDuration: {
        landing: '520ms',
      },
    },
  },
  plugins: [],
};

export default config;

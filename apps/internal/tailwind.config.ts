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
        linen: 'var(--linen)',
        porcelain: 'var(--porcelain)',
        chalk: 'var(--chalk)',
        graphite: 'var(--graphite)',
        brass: 'var(--brass)',
      },
    },
  },
  plugins: [],
};

export default config;

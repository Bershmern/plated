import type { Config } from 'tailwindcss';
import sharedConfig from '../../packages/ui/tailwind.config';

const config: Config = {
  presets: [sharedConfig],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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

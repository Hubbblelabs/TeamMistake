import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tm-navy': '#242424', // Studio Dialect Dark
        'tm-navy-light': '#2a2a2a',
        'tm-navy-lighter': '#333333',
        'tm-green': '#dfff00', // Studio Dialect Lime
        'tm-slate': '#d2d2d2', // Studio Dialect Text
        'tm-slate-light': '#e5e5e5',
        'tm-white': '#ffffff',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        body: ['var(--font-geist)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tm-navy': '#020c1b',
        'tm-navy-light': '#0a192f',
        'tm-navy-lighter': '#112240',
        'tm-green': '#64ffda',
        'tm-slate': '#8892b0',
        'tm-slate-light': '#a8b2d1',
        'tm-white': '#e6f1ff',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

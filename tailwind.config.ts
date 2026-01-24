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
        'tm-navy': '#0f1419',
        'tm-navy-light': '#1a1f2e',
        'tm-navy-lighter': '#252b3b',
        'tm-navy-elevated': '#2d3548',
        'tm-gold': '#d4a853',
        'tm-gold-light': '#e8c17a',
        'tm-gold-dark': '#b8923f',
        'tm-green': '#d4a853', // Alias for backward compatibility
        'tm-slate': '#9ca3af',
        'tm-slate-light': '#d1d5db',
        'tm-slate-muted': '#6b7280',
        'tm-white': '#f8fafc',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #1a1f2e 0%, #0f1419 50%, #1a1f2e 100%)',
      },
      boxShadow: {
        'glow': '0 0 50px rgba(212, 168, 83, 0.2)',
        'glow-intense': '0 0 80px rgba(212, 168, 83, 0.35)',
        'glow-subtle': '0 0 30px rgba(212, 168, 83, 0.1)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;

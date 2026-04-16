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
        qe: {
          bg: 'var(--qe-bg)',
          surface: 'var(--qe-surface)',
          'surface-2': 'var(--qe-surface-2)',
          ink: 'var(--qe-ink)',
          'ink-2': 'var(--qe-ink-2)',
          'ink-3': 'var(--qe-ink-3)',
          line: 'var(--qe-line)',
          'brand-500': 'var(--qe-brand-500)',
          'brand-600': 'var(--qe-brand-600)',
          'brand-100': 'var(--qe-brand-100)',
          'signal-live': 'var(--qe-signal-live)',
          'signal-warn': 'var(--qe-signal-warn)',
          'signal-busy': 'var(--qe-signal-busy)',
          'dark-bg': 'var(--qe-dark-bg)',
          'dark-surface': 'var(--qe-dark-surface)',
          'dark-ink': 'var(--qe-dark-ink)',
          'note-butter': 'var(--qe-note-butter)',
          'note-blush': 'var(--qe-note-blush)',
          'note-mint': 'var(--qe-note-mint)',
          'note-sky': 'var(--qe-note-sky)',
        },
      },
      borderRadius: {
        'qe-xs': 'var(--qe-r-xs)',
        'qe-sm': 'var(--qe-r-sm)',
        'qe-md': 'var(--qe-r-md)',
        'qe-lg': 'var(--qe-r-lg)',
        'qe-xl': 'var(--qe-r-xl)',
        'qe-pill': 'var(--qe-r-pill)',
      },
      boxShadow: {
        'qe-1': 'var(--qe-sh-1)',
        'qe-2': 'var(--qe-sh-2)',
        'qe-3': 'var(--qe-sh-3)',
      },
      spacing: {
        'qe-1': 'var(--qe-s-1)',
        'qe-2': 'var(--qe-s-2)',
        'qe-3': 'var(--qe-s-3)',
        'qe-4': 'var(--qe-s-4)',
        'qe-5': 'var(--qe-s-5)',
        'qe-6': 'var(--qe-s-6)',
        'qe-8': 'var(--qe-s-8)',
        'qe-10': 'var(--qe-s-10)',
        'qe-12': 'var(--qe-s-12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'SF Pro Text', 'sans-serif'],
        hand: ['Caveat', 'Segoe Script', 'cursive'],
      },
      fontSize: {
        'qe-display': ['clamp(40px, 6vw, 64px)', { lineHeight: '1.02' }],
        'qe-h1': ['32px', { lineHeight: '1.1' }],
        'qe-h2': ['24px', { lineHeight: '1.2' }],
        'qe-h3': ['18px', { lineHeight: '1.3' }],
        'qe-body': ['15px', { lineHeight: '1.5' }],
        'qe-small': ['13px', { lineHeight: '1.4' }],
        'qe-micro': ['11px', { lineHeight: '1.3' }],
      },
      letterSpacing: {
        'qe-tight': '-0.02em',
        'qe-snug': '-0.01em',
      },
    },
  },
  plugins: [],
};

export default config;

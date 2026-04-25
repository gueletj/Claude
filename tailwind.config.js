/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ever: {
          ink: '#0a0a0b',
          char: '#141416',
          surface: '#1c1c1f',
          line: '#2a2a2e',
          muted: '#7a7a82',
          paper: '#f5f1ea',
          flame: '#ff5a1f',
          ember: '#ff7a3a',
          spark: '#ffae5e',
        },
      },
      fontFamily: {
        display: ['"Anton"', '"Bebas Neue"', 'Impact', 'system-ui', 'sans-serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'island': '0 8px 24px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05) inset',
        'soft': '0 20px 60px -20px rgba(0,0,0,0.6)',
        'press': '0 2px 8px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};

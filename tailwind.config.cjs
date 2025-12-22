/***** Tailwind Config *****/
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0e13',
        foreground: '#e5e7eb',
        muted: '#a1a1aa',
        accent: {
          purple: '#a855f7',
          teal: '#14b8a6',
          blue: '#60a5fa'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui']
      },
      container: { center: true, padding: '1rem' }
    }
  },
  plugins: [],
}

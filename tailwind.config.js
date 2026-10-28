/** @type {import('tailwindcss').Config} */
export default {
  content: [
    \"./index.html\",
    \"./src/**/*.{js,ts,jsx,tsx}\",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080B12',
        bg2: '#0E1420',
        card: '#131B2A',
        border: 'rgba(91, 140, 255, 0.25)',
        primary: '#5B8CFF',
        violet: '#9366FF',
        cyan: '#55D6FF',
        accent: '#F4F7FF',
        muted: '#9BA8BF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}

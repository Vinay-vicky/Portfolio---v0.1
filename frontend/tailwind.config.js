/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#090a0f',
        darkCard: '#11131c',
      },
      backgroundImage: {
        'purple-blue': 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aventon-dark': '#2D4A22',
        'aventon-accent': '#4ade80',
        'aventon-light': '#F0F4EF',
      },
    },
  },
  plugins: [],
}
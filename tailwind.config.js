/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/frontend/**/*.{js,ts,jsx,tsx}", // Mencakup semua file di src
  ],
  darkMode: 'class', // Mengaktifkan dark mode berdasarkan class 'dark'
  theme: {
    extend: {},
  },
  plugins: [],
}
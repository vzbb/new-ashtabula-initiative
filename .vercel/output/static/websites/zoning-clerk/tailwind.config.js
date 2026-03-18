/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ashtabula: {
          primary: '#1e3a5f',
          secondary: '#c9a227',
          accent: '#2d5a87',
          bg: '#f8f9fa',
          // Legacy support or extra shades
          navy: '#1e3a5f',
          amber: '#c9a227',
        }
      }
    },
  },
  plugins: [],
}

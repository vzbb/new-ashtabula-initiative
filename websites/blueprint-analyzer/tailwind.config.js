/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: "#0a0a0f",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#a855f7",
          foreground: "#ffffff",
          glow: "rgba(168, 85, 247, 0.4)",
        },
        secondary: {
          DEFAULT: "#00d4ff",
          foreground: "#000000",
          glow: "rgba(0, 212, 255, 0.4)",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          foreground: "#ffffff",
          border: "rgba(255, 255, 255, 0.08)",
        },
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.5)",
          foreground: "rgba(255, 255, 255, 0.7)",
        },
        accent: {
          cyan: "#00d4ff",
          purple: "#a855f7",
        },
      },
    },
  },
  plugins: [],
}

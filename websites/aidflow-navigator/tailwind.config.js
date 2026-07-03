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
          DEFAULT: "#00d4ff",
          foreground: "#000000",
          glow: "rgba(0, 212, 255, 0.4)",
        },
        secondary: {
          DEFAULT: "#a855f7",
          foreground: "#ffffff",
          glow: "rgba(168, 85, 247, 0.4)",
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
      backdropBlur: {
        glass: '20px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glow-cyan': '0 0 30px rgba(0, 212, 255, 0.3)',
        'glow-purple': '0 0 30px rgba(168, 85, 247, 0.3)',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(30px, -30px) scale(1.05)' },
          '50%': { transform: 'translate(-20px, 20px) scale(0.95)' },
          '75%': { transform: 'translate(20px, 10px) scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
}

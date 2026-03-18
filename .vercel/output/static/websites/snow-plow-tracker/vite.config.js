import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/snow-plow-tracker/',
  plugins: [react()],
  server: {
    cors: true,
    proxy: {
      '/api': {
        target: 'https://generativelanguage.googleapis.com',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  define: {
    // Ensure environment variables are properly exposed
    'process.env': {}
  }
})

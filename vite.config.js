import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This forwards any request starting with '/api' to your backend
      '/api': {
        target: 'https://interiit-backend-5bmf.onrender.com/', // Your backend server URL
        changeOrigin: true,
      },
    }
  }
})
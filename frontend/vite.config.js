import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
      '/prediksi_tahap2': 'http://localhost:5001',
      '/analisis_gambar': 'http://localhost:5001',
      '/hasil': 'http://localhost:5001',
      '/logout': 'http://localhost:5001',
    },
  },
})

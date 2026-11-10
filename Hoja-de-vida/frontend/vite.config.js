import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages sirve el sitio en /Hoja-de-vida/. En desarrollo, /api se reenvía a la API.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
  server: { proxy: { '/api': 'http://localhost:3000' } },
})

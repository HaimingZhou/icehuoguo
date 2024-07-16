import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9793,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:1119',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/static': {
        target: 'http://localhost:1119',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/static/, '/static'),
      },
    },
  },
})

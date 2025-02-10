import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    tailwindcss()
  ],
  build: {
    target: 'es2023'
  },
  optimizeDeps: {
    include: ['lucide-react', 'tailwind-variants', 'tailwind-merge']
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8001'
    }
  }
})

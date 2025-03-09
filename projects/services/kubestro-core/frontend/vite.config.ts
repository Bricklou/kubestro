import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { reactRouterDevTools } from 'react-router-devtools'

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    reactRouterDevTools(),
    reactRouter(),
    tsconfigPaths(),
    tailwindcss(),
  ],
  build: {
    target: 'es2023'
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8001'
    }
  }
})

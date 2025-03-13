import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { reactRouterDevTools } from 'react-router-devtools'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  root: import.meta.dirname,
  plugins: [
    reactRouterDevTools(),
    tsconfigPaths(),
    tailwindcss(),
    react()
  ],
  build: {
    target: 'es2023',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react'
          }

          if (id.includes('design-system')) {
            return 'design-system'
          }

          if (id.includes(('node_modules'))) {
            return 'vendor'
          }
          return null
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8001'
    }
  }
})

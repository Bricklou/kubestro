import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
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
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { federation } from '@module-federation/vite'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  server: {
    origin: 'http://localhost:5174',
    port: 5174
  },
  preview: {
    port: 5174
  },
  base: 'http://localhost:5174/',
  plugins: [
    federation({
      name: 'module-federation-test',
      manifest: true,
      exposes: {
        './export-app': './src/app.tsx'
      },
      shared: {
        'react': {
          version: '19.0.0',
          singleton: true
        },
        'react-dom': {
          version: '19.0.0',
          singleton: true
        },
        'react-router': {
          version: '7.3.0',
          singleton: true
        },
        '@kubestro/design-system/': {
          version: '1.0.0',
          singleton: true
        }
      }
    }),
    tailwindcss(),
    react(),
    tsconfigPaths()
  ],
  build: {
    target: 'esnext',
    minify: false
  }
})

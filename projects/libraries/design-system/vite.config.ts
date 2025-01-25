import path, { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import pkgJson from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    // Use the 'vite-plugin-dts' plugin to generate TypeScript declaration files
    dts({ tsconfigPath: './tsconfig.lib.json' })
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'design-system',
      formats: ['es'],
      fileName: format => `design-system.${format}.js`
    },
    rollupOptions: {
      external: [...Object.keys(pkgJson.peerDependencies)],
      output: {
        globals: {
          react: 'React'
        }
      }
    },
    // Generates sourcemaps for debugging
    sourcemap: true,
    // Clears the output directory before building
    emptyOutDir: true
  }
})

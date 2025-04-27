import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'
import eslintPlugin from 'vite-plugin-eslint';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin(),
    tailwindcss(),
  ],
  build: {
      outDir: 'build',
      sourcemap: true,
  },
  server: {
      open: true,
      port: 3000,
      proxy: {
        '/api': 'http://localhost:61001',
      }
  },
});
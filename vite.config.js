import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures assets are correctly linked in production
  server: {
    port: 5173,
    open: true, // Auto-opens browser
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser', // Optimizes 3D assets and scripts
  }
});
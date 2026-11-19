import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// .js files in src/ contain JSX, so tell Vite/esbuild to treat them as JSX.
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: { loader: { '.js': 'jsx' } },
  },
  server: {
    port: 5173,
    // In development, forward /api calls to the Express server
    proxy: { '/api': 'http://localhost:5000' },
  },
});

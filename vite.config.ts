import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@api':      path.resolve(__dirname, 'src/api'),
      '@core':     path.resolve(__dirname, 'src/core'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@pages':    path.resolve(__dirname, 'src/pages'),
      '@shared':   path.resolve(__dirname, 'src/shared'),
    }
  }
});

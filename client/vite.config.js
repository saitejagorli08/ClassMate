import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-dist-to-root',
      closeBundle() {
        try {
          const clientDist = path.resolve(__dirname, 'dist');
          const rootDist = path.resolve(__dirname, '../dist');
          if (fs.existsSync(clientDist)) {
            fs.cpSync(clientDist, rootDist, { recursive: true });
            console.log('✅ Synchronized client/dist -> ../dist');
          }
        } catch (e) {
          console.warn('Sync dist error:', e.message);
        }
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          icons: ['lucide-react'],
        },
      },
    },
  },
});

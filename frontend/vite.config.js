import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/note': 'http://localhost:8001',
      '/user': 'http://localhost:8001',
    },
  },
});
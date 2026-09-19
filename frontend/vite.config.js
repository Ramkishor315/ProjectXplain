import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Microsoft Edge me open karne ke liye browser specify kiya hai
process.env.BROWSER = 'msedge';

export default defineConfig({
  plugins: [react()],
  server: {
    open:'chrome',
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
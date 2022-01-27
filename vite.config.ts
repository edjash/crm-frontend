import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (mode === 'staging' || mode == 'production') {
    return {
      base: '/',
      plugins: [react()],
      build: {
        outDir: '../server/public/frontend',
        assetsDir: '',
        emptyOutDir: true,
      },
    };
  } else {
    return {
      base: '/',
      plugins: [react()],
      server: {
        port: 9000,
        host: '0.0.0.0',
      },
    };
  }
});

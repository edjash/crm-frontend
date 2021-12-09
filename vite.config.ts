import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (mode === 'staging') {
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
    };
  }
});

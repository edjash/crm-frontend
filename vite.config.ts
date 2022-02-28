import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let config = {};

  switch (mode) {
    case 'production':
      config = {
        base: '/',
        plugins: [react()],
        build: {
          outDir: '../server/public/frontend',
          assetsDir: '',
          emptyOutDir: true,
        }
      }
      break;
    case 'mobile':
      config = {
        base: '/',
        plugins: [react()],
        server: {
          port: 9000,
          host: '0.0.0.0',
          hmr: {
            port: 9002
          }
        },
      }
      break;
    case 'development':
    default:
      config = {
        base: '/',
        plugins: [react()],
        server: {
          port: 9000,
          host: '0.0.0.0',
        },
      }
  }

  return config;
});

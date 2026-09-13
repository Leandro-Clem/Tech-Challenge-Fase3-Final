import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// O back-end da Fase 2 não habilita CORS. Para não precisar alterá-lo,
// o Vite atua como proxy reverso: tudo que sair do front em /api
// é encaminhado para http://localhost:3000 (mesma origem para o navegador).
const proxy = {
  '/api': {
    target: process.env.VITE_PROXY_TARGET || 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy },
  preview: { port: 4173, proxy },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
  },
});

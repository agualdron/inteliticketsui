import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_');
  const basePath = env.VITE_BASE_PATH || '/';
  const apiBasePath = env.VITE_API_BASE_URL || 'http://localhost:8080';

  return {
    base: basePath.endsWith('/') ? basePath : `${basePath}/`,
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: apiBasePath,
          changeOrigin: true,
        },
      },
    },
  };
});

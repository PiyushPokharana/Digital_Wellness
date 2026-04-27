import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.BACKEND_DEV_PROXY_TARGET;

  const serverConfig = {
    port: 3000,
  };

  if (proxyTarget) {
    serverConfig.proxy = {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      }
    };
  }

  return {
    plugins: [react()],
    server: serverConfig,
  };
})

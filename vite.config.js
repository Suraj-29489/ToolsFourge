import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.error('[Vite Proxy Error]:', err.message);
            if (res && !res.headersSent) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                success: false,
                error: {
                  message: 'Backend server unavailable. Please check if Express server is running on port 5000.',
                  code: 'PROXY_ERROR'
                }
              }));
            }
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log(`[Vite Proxy Forwarding]: ${req.method} ${req.url} -> http://127.0.0.1:5000${proxyReq.path}`);
          });
        },
      },
    },
  },
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.PAGES_BASE ?? '/',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Allow Claude Code on the web's forwarded preview domains (and any tunnel)
    allowedHosts: true,
    cors: true,
    hmr: {
      // HMR over the forwarded https tunnel needs the wss client port
      clientPort: 443,
      protocol: 'wss',
    },
  },
  preview: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
});

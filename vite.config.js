import { defineConfig } from 'vite';

// Prevent Vite from exiting when stdin closes in non-interactive daemon/pre-warming environments
process.env.CI = 'true';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
});


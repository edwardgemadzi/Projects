import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Force consistent port
    hmr: {
      overlay: false, // Disable error overlay that might interfere
      clientPort: 5173, // Ensure WebSocket uses correct port
      port: 5173, // Explicit HMR port
      host: 'localhost', // Explicit host
    },
    // Additional WebSocket stability options
    watch: {
      usePolling: true, // Use polling for file watching
      interval: 1000, // Polling interval
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5002',
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying
      },
    },
  },
  // Additional optimizations
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    sourcemap: true, // Enable source maps for debugging
  },
})

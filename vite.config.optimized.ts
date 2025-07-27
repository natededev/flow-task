import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Performance optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-avatar', '@radix-ui/react-dropdown-menu', '@radix-ui/react-dialog'],
          icons: ['lucide-react'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    // Enable compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 8080
  }
})

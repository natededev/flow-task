import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Enable compression in dev server
    middlewareMode: false,
    hmr: {
      overlay: false
    }
  },
  plugins: [
    react({
      // No custom swc plugins needed; Fast Refresh is enabled by default
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Enable experimental features for better performance
  esbuild: {
    // Drop console logs in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    // Reduce JS payload size
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    // Target modern browsers only
    target: 'es2020',
  },
  build: {
    // Performance optimizations
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    // Reduce chunk sizes aggressively
    // Enable tree shaking
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom', 'react/jsx-runtime'],
          // Split Radix UI more granularly to reduce unused code
          'ui-core': ['@radix-ui/react-avatar', '@radix-ui/react-slot', '@radix-ui/react-separator'],
          'ui-overlay': ['@radix-ui/react-dropdown-menu', '@radix-ui/react-dialog'],
          'ui-popover': ['@radix-ui/react-popover', '@radix-ui/react-hover-card'],
          'ui-form': ['@radix-ui/react-select', '@radix-ui/react-label', '@radix-ui/react-checkbox'],
          'ui-feedback': ['@radix-ui/react-toast', '@radix-ui/react-tooltip'],
          'ui-navigation': ['@radix-ui/react-tabs', '@radix-ui/react-navigation-menu'],
          'ui-layout': ['@radix-ui/react-scroll-area', '@radix-ui/react-collapsible'],
          // Icons - this is the biggest chunk, separate it
          'icons': ['lucide-react'],
          // Router
          'router': ['react-router-dom'],
          // State Management
          'query': ['@tanstack/react-query'],
          'state': ['zustand'],
          // Forms
          'forms': ['react-hook-form', '@hookform/resolvers'],
          // Date utilities
          'date': ['date-fns', 'react-day-picker'],
          // Validation
          'validation': ['zod'],
          // Utilities
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority'],
          // Toast notifications
          'notifications': ['sonner'],
          // Theme
          'theme': ['next-themes']
        },
        // Optimize chunk names for caching
        chunkFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes('vendor') || chunkInfo.name.includes('icons')) {
            return `assets/[name]-[hash].js`;
          }
          return `assets/[name]-[hash].js`;
        },
        // Optimize asset names
        assetFileNames: `assets/[name]-[hash].[ext]`
      }
    },
    // Enhanced minification - single consolidated configuration
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug', 'console.warn'] : [],
        // Remove unused code more aggressively
        dead_code: true,
        unused: true,
        // Additional optimizations
        passes: 3,
        keep_fargs: false,
        hoist_funs: true,
        reduce_vars: true,
        collapse_vars: true,
      },
      mangle: {
        safari10: true,
        toplevel: true
      },
      format: {
        comments: false
      }
    },
    // Reduce chunk size warning limit to force smaller chunks
    chunkSizeWarningLimit: 400,
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom', 
        'react-router-dom',
        '@tanstack/react-query'
      ],
      exclude: [
        'lucide-react' // This will be code-split
      ]
    },
    // Enable advanced chunk splitting
    reportCompressedSize: false, // Skip compressed size reporting for faster builds
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  // Enable compression in dev server for testing
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    }
  }
}));

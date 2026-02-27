import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    // Modern browser targeting
    target: 'es2022',
    cssTarget: 'es2022',
    // Optimize chunking
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['prop-types'],
          // Feature chunks
          'feature-auth': ['./src/ui/pages/login/Login.jsx'],
          'feature-profile': ['./src/ui/pages/profile/Profile.jsx'],
          'feature-explore': ['./src/ui/pages/explore/Explore.jsx'],
          'feature-home': ['./src/ui/pages/home/Home.jsx'],
        }
      }
    },
    // Optimize assets
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    sourcemap: true
  },
  // Development server config
  server: {
    port: 3000,
    strictPort: false,
    open: true,
    cors: true
  },
  // Preview server config
  preview: {
    port: 4173,
    strictPort: false
  },
  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  },
  // Resolve aliases
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/ui/pages',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@context': '/src/context',
      '@styles': '/src/styles',
      '@assets': '/src/assets'
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: []
  }
})

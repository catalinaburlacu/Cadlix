import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.dicebear\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'avatar-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.+\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Cadlix - Anime & Streaming Platform',
        short_name: 'Cadlix',
        description: 'Your ultimate destination for anime, movies, and series streaming',
        theme_color: '#8A2BE2',
        background_color: '#0A0F3D',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
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
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
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

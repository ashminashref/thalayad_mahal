import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      // Include assets to be cached for offline use
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], 
      manifest: {
        name: 'Mahal Connect',
        short_name: 'MahalConnect',
        description: 'Premium Community Management Portal for Mahal Services',
        display: 'standalone',
        theme_color: '#1c3124', // Mahal Green
        background_color: '#f9f8f6',
        icons: [
          {
            src: '/pwa-152x152.png', 
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-310x310.png', 
            sizes: '310x310',
            type: 'image/png',
            purpose: 'any maskable' // Recommended for better icon fit on Android
          }
        ]
      },
      workbox: {
        // Cache all static assets (JS, CSS, HTML, Images)
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], 
        runtimeCaching: [
          {
            // Cache API responses for offline viewing
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'), 
            handler: 'NetworkFirst', // Use network if available, otherwise use cache
            options: {
              cacheName: 'api-data-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // Cache for 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
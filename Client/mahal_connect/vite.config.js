import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mahal Connect',
        short_name: 'MahalConnect',
        display: 'standalone',
        theme_color: '#1c3124',
        background_color: '#f9f8f6',
        icons: [
          {
            src: '/pwa-152x152.png', 
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/pwa-310x310.png', 
            sizes: '310x310',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
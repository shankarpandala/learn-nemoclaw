import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Learn NemoClaw',
        short_name: 'NemoClaw',
        description: 'Interactive learning platform for NVIDIA NemoClaw AI agent security orchestration',
        theme_color: '#76B900',
        background_color: '#0f172a',
        display: 'standalone',
        scope: '/learn-nemoclaw/',
        start_url: '/learn-nemoclaw/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        navigateFallback: '/learn-nemoclaw/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  base: '/learn-nemoclaw/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('framer-motion') || id.includes('lucide')) {
              return 'vendor-ui'
            }
            if (
              id.includes('react-syntax-highlighter') ||
              id.includes('refractor') ||
              id.includes('prismjs')
            ) {
              return 'vendor-code'
            }
          }
          for (const n of ['01', '02', '03', '04', '05', '06', '07', '08']) {
            if (id.includes(`subjects/${n}`)) return `subject-${n}`
          }
        }
      }
    }
  }
})

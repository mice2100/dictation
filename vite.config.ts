// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/nprdict/',
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    mkcert(),
    VitePWA({
      mode: 'development',
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png}', '**/assets/*.*']
      },
      manifest: {
        name: 'NPRNews Dictation',
        short_name: 'NPRNews Dictation',
        description: 'Learn English from NPR News Dictation',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'img/pwa-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'img/pwa-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    host: true,
    port: 3000,
    https: true,
    proxy: {
      '/npreefe': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  },
})

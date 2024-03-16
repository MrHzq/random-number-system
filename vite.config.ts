import { fileURLToPath, URL } from 'node:url'
import ip from 'ip'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/random-number-system/',
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    open: true,
    host: ip.address()
  }
})

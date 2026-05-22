import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import fs from 'fs'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template:{
        compilerOptions:{
          isCustomElement: (tag) => tag.startsWith('fluent-')
        }
      }
    }
    ),
    vueJsx(),
    vueDevTools(),
    {
      name: 'spa-fallback',
      closeBundle() {
        try {
          fs.copyFileSync('dist/index.html', 'dist/404.html')
        } catch (e) {
          // ignore if copy fails during dev or missing dist
        }
      },
    },
  ],
  base: '/ClashWinUIWeb/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

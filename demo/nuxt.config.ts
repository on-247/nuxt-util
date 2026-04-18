import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    ['../src/module', {
      'captcha.sitekey': process.env.CAPTCHA_SITEKEY,
      'icon.path': 'demo/icons.ts',
      "modal.path": 'demo/modals'
    }]
  ],
  sourcemap: false,
  devtools: {enabled: false},
  vite: {
    server: {
      hmr: {
        path: 'ws'
      }
    },
    optimizeDeps: {
      include: [
        'browser-detect',
        'ulid',
        'vanilla-lazyload',
      ]
    }
  }
})
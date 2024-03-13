import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
    extends: ['nuxt-seo-kit'],

    runtimeConfig: {
        public: {
            captcha: {
                sitekey: "1x00000000000000000000AA"
            }
        }
    },

    modules: [
        '../src/module',
    ],

    ssr: true,
    sourcemap: false,

    devtools: {enabled: false}
})
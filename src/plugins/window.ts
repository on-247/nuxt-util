import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.config.globalProperties.$window = process.client ? window : undefined
})
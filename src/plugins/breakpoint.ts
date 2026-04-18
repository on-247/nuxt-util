import { defineNuxtPlugin } from 'nuxt/app'
import { is } from '../lib/breakpoint'
import { between } from '../lib/breakpoint'
import { useBreakpoint } from '../composables/breakpoint'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.config.globalProperties.$breakpoint = {
    current: useBreakpoint().current,
    is,
    between
  }
})
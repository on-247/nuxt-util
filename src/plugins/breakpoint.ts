import { defineNuxtPlugin } from 'nuxt/app'
import { is, between } from '../lib/breakpoint'
import { useBreakpoint } from '../composables/breakpoint'

export default defineNuxtPlugin(nuxtApp => {
    const breakpoint = useBreakpoint()
    nuxtApp.vueApp.config.globalProperties.$breakpoint = {
        current: breakpoint.current,
        is,
        between
    }
})
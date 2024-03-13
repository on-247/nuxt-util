import { defineNuxtPlugin } from 'nuxt/app'
import { useBrowserDetect } from '../composables/browser'

export default defineNuxtPlugin(nuxtApp => {
    let detected = useBrowserDetect()
    nuxtApp.vueApp.config.globalProperties.$browser = {
        name: detected.name,
        version: detected.version,
        versionNumber: detected.versionNumber,
        os: detected.os,
        mobile: detected.mobile,
        get ios() {
            return detected.os.toLowerCase().includes('ios')
        },
        get windows() {
            return detected.os.toLowerCase().includes('windows')
        }
    }
})
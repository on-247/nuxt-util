import {
    defineNuxtModule,
    createResolver,
    addComponent,
    addImportsDir,
    addPlugin,
} from '@nuxt/kit'

import type { Ref } from 'vue'
import type { Breakpoint, RangeArgs } from './lib/breakpoint'

interface BreakpointPlugin {
    current: Ref<Breakpoint>,
    is: (assertion: Breakpoint) => boolean,
    between: (...assertions: RangeArgs) => boolean
}

interface BrowserPlugin {
    name: string
    version: number
    versionNumber: string
    os: string
    mobile: boolean
    ios: boolean
    windows: boolean
}

declare module 'vue' {
	interface ComponentCustomProperties  {
		$window?: Window
		$browser: BrowserPlugin
		$breakpoint: BreakpointPlugin
	}
}

interface NuxterplateModuleOptions {}

const components = [
    ['Icon',            './components/icon/Icon.vue'],

    ['ImageLazy',       './components/lazy/Image.vue'],
    ['VideoLazy',       './components/lazy/Video.vue'],

    ['Captcha',         './components/captcha/Captcha.vue'],

    ['CreditsEmbed',    './components/CreditsEmbed.vue'],

    ['Form',            './components/form/Form.vue'],
    ['FormInput',       './components/form/Input.vue'],
    ['FormCheckbox',    './components/form/Checkbox.vue'],
    ['FormRadio',       './components/form/Radio.vue'],
    ['FormLabel',       './components/form/Label.vue'],
    ['FormIndicator',   './components/form/Indicator.vue'],

    ['NativeInput',     './components/form/native/Input.vue'],
    ['NativeCheckbox',  './components/form/native/Checkbox.vue'],
]

export default defineNuxtModule<NuxterplateModuleOptions>({
    meta: {
        name: 'nuxterplate',
        configKey: 'nuxterplate',
        compatibility: {
            nuxt: '^3.6.0'
        }
    },
    setup(moduleOptions, nuxt) {
        const resolver = createResolver(import.meta.url)

        // Resolve CSS
        nuxt.options.css.push(resolver.resolve('assets/css/breakpoint.css'))

        // Resolve components
        for (let [name, filePath] of components) addComponent({
            name,
            filePath: resolver.resolve(filePath)
        })

        // Resolve composables
        addImportsDir(resolver.resolve('composables'))

        // Resolve plugins
        addPlugin(resolver.resolve('plugins/window'))
        addPlugin(resolver.resolve('plugins/browser'))
        addPlugin(resolver.resolve('plugins/breakpoint'))
    }
})
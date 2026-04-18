import type { Ref } from 'vue'
import type { Breakpoint } from './lib/breakpoint'
import type { RangeArgs } from './lib/breakpoint'
import { defineNuxtModule } from '@nuxt/kit'
import { createResolver } from '@nuxt/kit'
import { addComponent } from '@nuxt/kit'
import { addImportsDir } from '@nuxt/kit'
import { addPlugin } from '@nuxt/kit'

type BreakpointPlugin = {
  current: Ref<Breakpoint>,
  is: (assertion: Breakpoint) => boolean,
  between: (...assertions: RangeArgs) => boolean
}

type BrowserPlugin = {
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

type NuxtUtilModuleOptions = {
  icon_path?: string;
  iconPath?: string;
  'icon.path'?: string;
  modal_path?: string;
  modalPath?: string;
  'modal.path'?: string;
}


const components: [string, string][] = [
  ['Icon', './components/icon/Icon.vue'],
  ['ImageLazy', './components/lazy/Image.vue'],
  ['VideoLazy', './components/lazy/Video.vue'],
  ['Captcha', './components/captcha/Captcha.vue'],
  ['Form', './components/form/Form.vue'],
  ['FormInput', './components/form/Input.vue'],
  ['FormCheckbox', './components/form/Checkbox.vue'],
  ['FormRadio', './components/form/Radio.vue'],
  ['FormLabel', './components/form/Label.vue'],
  ['FormIndicator', './components/form/Indicator.vue'],
  ['NativeInput', './components/form/native/Input.vue'],
  ['NativeCheckbox', './components/form/native/Checkbox.vue'],
  ['ModalRenderer', './components/modal/Renderer.vue'],
]

export default defineNuxtModule<NuxtUtilModuleOptions>({
  meta: {
    name: '@on-247/nuxt-util',
    configKey: '@on-247/nuxt-util',
    compatibility: {
      nuxt: '>=4.0.0',
    },
  },
  async setup(moduleOptions, nuxt) {
    const src_path = __dirname
    var installation_mode = src_path.includes('node_modules');
    var root = (installation_mode
      ? src_path.split('/node_modules')
      : src_path.split('/src')
    ).shift() + (installation_mode ? '/app' : '');
    var web_root = '/_nuxt/@fs' + root;

    console.info(`nuxt-util webroot: ${web_root}`);

    const resolver = createResolver(src_path)
    if ('captcha.sitekey' in moduleOptions) {
      nuxt.options.runtimeConfig.public.captcha = {
        sitekey: moduleOptions['captcha.sitekey']
      }
    }

    nuxt.options.runtimeConfig.public.icon_path = moduleOptions['icon.path']
      ? resolver.resolve(web_root, moduleOptions['icon.path'])
      : resolver.resolve(web_root, '/icons')

    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolver.resolve(
          root,  // @ts-ignore
          'modal.path' in moduleOptions
          ? moduleOptions['modal.path']
          : 'components/modals'
        ),
        global: true,
        prefix: 'Modals',
        pathPrefix: false,
      });
    })

    nuxt.options.css.push(resolver.resolve('assets/css/breakpoint.css'))
    for (let [name, filePath] of components) {
      addComponent({
        name,
        filePath: resolver.resolve(filePath)
      })
    }
    addImportsDir(resolver.resolve('composables'))
    addPlugin(resolver.resolve('plugins/window'))
    addPlugin(resolver.resolve('plugins/browser'))
    addPlugin(resolver.resolve('plugins/breakpoint'))
  }
})
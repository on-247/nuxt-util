<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { createError } from 'nuxt/app';

type Appearance =
    | 'always'
    | 'execute'
    | 'interaction-only'
type Theme =
    | 'auto'
    | 'light'
    | 'dark'
type Language =
    | 'auto'
    | 'en'
    | 'de'
    | 'nl'

interface Emits {
    (e: 'update:modelValue', token?: string): void
    (e: 'verify', token: string): void
    (e: 'expire'): void
    (e: 'fail'): void
}

interface Props {
    sitekey: string
    appearance?: Appearance,
    theme?: Theme,
    lang?: Language,
    formFieldName? : string
}

const emit = defineEmits<Emits>()
const prop = withDefaults(defineProps<Props>(), {
    appearance: 'always',
    theme: 'auto',
    lang: 'auto',
    formFieldName: 'cf-turnstile-response'
})

const widgetId = `#turnstile-widget`
const scriptId = '#turnstile-script'

const renderTurnstile = () => {
    // @ts-ignore
    window.turnstile?.render(widgetId, {
        'sitekey': prop.sitekey,
        'appearance': prop.appearance,
        'theme': prop.theme,
        'language': prop.lang,
        'response-field-name': prop.formFieldName,
        'callback': (token: string) => {
            emit('update:modelValue', token)
            emit('verify', token)
        },
        'expired-callback': () => {
            emit('update:modelValue', undefined)
            emit('expire')
        },
        'error-callback': () => {
            emit('update:modelValue', undefined)
            emit('fail')
        }
    })
}

onMounted(() => {
    if (!prop.sitekey) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Turnstile captcha sitekey could not be resolved',
            fatal: true
        })
    }

    if (!document.querySelector(scriptId)) {
        const script = document.createElement('script')
        script.id = 'turnstile-script'
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'
        script.async = true
        script.defer = true
        document.head.appendChild(script)

        // @ts-ignore
        window.onloadTurnstileCallback = () => renderTurnstile()
    }
    else {
        renderTurnstile()
    }
})

onBeforeUnmount(() => {
    // @ts-ignore
    window?.turnstile?.remove(widgetId)
})
</script>

<template>
    <div :id="widgetId.replace('#', '')" />
</template>
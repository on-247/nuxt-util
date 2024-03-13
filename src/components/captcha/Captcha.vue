<script setup lang="ts">
import { useRuntimeConfig } from 'nuxt/app'
import CfTurnstile from './CfTurnstile.vue'

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
    (e: 'verify', token: string): void
    (e: 'expire'): void
    (e: 'fail'): void
}

interface Props {
    sitekey?: string
    appearance?: Appearance
    theme?: Theme
    lang?: Language
    global?: boolean
    fieldName?: string
}

defineEmits<Emits>()
defineProps<Props>()

const runtimeConfig = useRuntimeConfig().public
const captcha = useCaptcha()

const onVerify = (token: string) => {
    captcha.isVerifying = false
    captcha.isError = false
    captcha.token = token
}

const onInvalid = () => {
    captcha.isVerifying = false
    captcha.isError = true
    captcha.token = null
}

onMounted(() => {
    captcha.isVerifying = true
    captcha.isError = false
})

onBeforeUnmount(() => {
    captcha.isVerifying = true
    captcha.isError = false
})
</script>

<template>
    <!-- Global Cf Turnstile captcha is a self sustaining compnent and doesn't need any props -->
    <cf-turnstile
        v-if="global"
        :sitekey="sitekey || runtimeConfig.captcha.sitekey"
        appearance="interaction-only"
        @verify="onVerify"
        @expire="onInvalid"
        @fail="onInvalid"
    />
    <!-- Normal Cf Turnstile captcha has optional props -->
    <cf-turnstile
        v-else
        :sitekey="sitekey || runtimeConfig.captcha.sitekey"
        :appearance="appearance"
        :theme="theme"
        :lang="lang"
        :form-field-name="fieldName"
        @verify="token => $emit('verify', token)"
        @expire="$emit('expire')"
        @fail="$emit('fail')"
    />
</template>./CfTurnstile.vue
<script setup lang="ts">
import {onMounted} from 'vue';
import {onBeforeUnmount} from 'vue';
import {useRuntimeConfig} from 'nuxt/app';
import CfTurnstile from './CfTurnstile.vue';
import {useCaptcha} from '../../composables/captcha';

type Appearance = 'always' | 'execute' | 'interaction-only';
type Theme = 'auto' | 'light' | 'dark';
type Language = 'auto' | 'en' | 'de' | 'nl';
type Emits = {
  (e: 'verify', token: string): void;
  (e: 'expire'): void;
  (e: 'fail'): void;
}
type Props = {
  sitekey?: string;
  appearance?: Appearance;
  theme?: Theme;
  lang?: Language;
  global?: boolean;
  fieldName?: string;
}

defineEmits<Emits>();
const prop = defineProps<Props>();
const config = useRuntimeConfig().public;
const captcha = useCaptcha();
const onVerify = (token: string) => {
  captcha.isVerifying = false;
  captcha.isError = false;
  captcha.token = token;
};
const onInvalid = () => {
  captcha.isVerifying = false;
  captcha.isError = true;
  captcha.token = null;
}
onMounted(() => {
  if (prop.sitekey || config.captcha.sitekey) {
    captcha.isVerifying = true;
    captcha.isError = false;
    return;
  }
  var e = '[CAPTCHA] Turnstile sitekey missing';
  useLogError('[CAPTCHA]', e);
  onInvalid();
});
onBeforeUnmount(() => {
  captcha.isVerifying = true;
  captcha.isError = false;
});
</script>

<template>
  <cf-turnstile
    v-if="global"
    :sitekey="sitekey || config.captcha.sitekey"
    appearance="interaction-only"
    @verify="onVerify"
    @expire="onInvalid"
    @fail="onInvalid"
  />
  <cf-turnstile
    v-else
    :sitekey="sitekey || config.captcha.sitekey"
    :appearance="appearance"
    :theme="theme"
    :lang="lang"
    :form-field-name="fieldName"
    @verify="token => $emit('verify', token)"
    @expire="$emit('expire')"
    @fail="$emit('fail')"
  />
</template>
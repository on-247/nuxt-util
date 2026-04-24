<script setup lang="ts">
import { onMounted } from 'vue';
import { onBeforeUnmount } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import CfTurnstile from './CfTurnstile.vue';
import { useCaptcha } from '../../composables/captcha';
import { useLogger } from '../../composables/debug';

const LOG = useLogger();

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
const onVerify = (token?: string) => {
  LOG.debug('[CAPTCHA]', 'Verifying...');
  captcha.isVerifying = false;
  captcha.isError = false;
  (token && (captcha.token = token));
};
const onInvalid = () => {
  LOG.debug('[CAPTCHA]', 'Invalid');
  captcha.isVerifying = false;
  captcha.isError = true;
  captcha.token = null;
}
onMounted(() => {
  if (prop.sitekey || config.captcha.sitekey) {
    onVerify();
    return;
  }
  LOG.warn('[CAPTCHA]', 'Turnstile sitekey missing');
  onInvalid();
});
onBeforeUnmount(() => onVerify());
</script>

<template>
  <CfTurnstile
    :sitekey="sitekey || config.captcha.sitekey"
    :appearance="global ? 'interaction-only' : appearance"
    :theme="theme"
    :lang="lang"
    :form-field-name="fieldName"
    @verify="token => (onVerify(token), $emit('verify', token))"
    @expire="(onInvalid(), $emit('expire'))"
    @fail="(onInvalid(), $emit('fail'))"
  />
</template>
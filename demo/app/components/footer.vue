<script setup lang="ts">
const state = useCaptcha()
</script>

<template>
  <footer style="padding:0 20px;">
    <span v-if="state.isVerifying">Captcha verifying</span>
    <span v-else-if="state.isError">Captcha error</span>
    <span v-else-if="state.token">Captcha {{ state.token }}</span>
    <captcha
      global
    />
  </footer>
  <ModalRenderer />
</template>

<style scoped>
footer {
  margin-top: 50px;
}
</style>
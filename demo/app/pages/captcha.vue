<script setup lang="ts">
const config = useRuntimeConfig().public
</script>

<template>
  <captcha
    :sitekey="config.captcha?.sitekey ?? '1x00000000000000000000AA'"
    theme="light"
    @verify="token => $window?.alert(token)"
  />
</template>
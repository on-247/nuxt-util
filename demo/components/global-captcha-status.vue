<script setup lang="ts">
const state = useCaptcha()
</script>

<template>
    <span v-if="state.isVerifying">Captcha verifying</span>
    <span v-else-if="state.isError">Captcha error</span>
    <span v-else-if="state.token">Captcha {{ state.token }}</span>
    <captcha
        global
    />
</template>
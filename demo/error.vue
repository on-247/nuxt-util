<script setup lang="ts">
defineProps({
  error: Object
})
</script>

<template>
    <main style="padding:0 20px;">
        <h1>{{ error?.statusCode || 500 }}</h1>
        <p>{{ error?.statusMessage || error?.message || 'An uknown error occured' }}</p>
    </main>
</template>

<script setup lang="ts">
const timer = useNBTimer((then, now) => seconds.value += 1, { ms: 1000});
const seconds = ref(0)

onBeforeUnmount(timer.remove)
</script>

<template>
  <h1>Welcome to this demo</h1>
  <div>Seconds that have passed: {{seconds}}</div>
  <button type="button" @click="seconds = 0">Reset</button>
</template>

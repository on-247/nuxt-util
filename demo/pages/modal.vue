<script setup lang="ts">
useModalRegister(['test.edit']);
</script>

<template>
  <button
    @click="useModalActivate('test.edit')"
  >
    Test edit modal
  </button>
</template>
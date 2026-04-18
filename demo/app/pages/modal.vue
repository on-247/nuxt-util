<script setup lang="ts">
useModalRegister(['test.modal', 'test.context']);
</script>

<template>
  <div
    page-modal
    class="flex items-center gap-4"
  >
    <button
      @click="useModalActivate('test.modal')"
    >
      Test modal
    </button>

    <button
      @click="$evt => useModalActivate('test.context', { target: $evt.target })"
    >
      Test context modal
    </button>
  </div>
</template>
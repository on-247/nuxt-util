<script setup lang="ts">
const rendered = useModalRender()
</script>

<template>
  <div
    v-for="component, renderId in rendered"
  >
    <Component
      class="z-[100]"
      :is="component()"
      @close="useModalDeactivate(renderId)"
    />
  </div>
</template>
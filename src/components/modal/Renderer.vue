<script setup lang="ts">
import { useModalRender } from '../../composables/modals';
import { useModalDeactivate } from '../../composables/modals';
const rendered = useModalRender();
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
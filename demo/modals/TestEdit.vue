<script setup lang="ts">
type Props = {
  id: string;
  data: any;
  close: any;
}

defineProps<Props>();
</script>

<template>
  <span>
    <div
      class="fixed w-full h-full inset-0 bg-black/[0.3]"
      @click="close"
    />
    <div class="pointer-events-none fixed w-full h-full inset-0 flex items-center justify-center">
      This is a test edit modal with render ID {{ id }}
    </div>
  </span>
</template>
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
    <div :class="`
      pointer-events-none
      fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
      flex items-center justify-center
      bg-white px-2 py-1`
    ">
      This is a test modal with render ID {{ id }}
      <Icon name="x" @lick="close" />
    </div>
  </span>
</template>
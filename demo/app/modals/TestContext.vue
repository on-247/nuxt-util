<script setup lang="ts">
type Props = {
  id: string;
  data: any;
  close: any;
}

defineProps<Props>();
</script>

<template>
  <ModalContext :="{
    close,
    bottom: true,
    target: data.target,
    shadow: true,
    shadowCls: 'bg-black/[0.8]',
  }">
    <div class="flex items-center gap-2 bg-white px-2 py-1">
      This is a test context modal with render ID {{ id }}
      <Icon name="x" @click="close" />
    </div>
  </ModalContext>
</template>
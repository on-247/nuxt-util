<script setup lang="ts">
import { ref } from 'vue';
import { computed } from 'vue';

type Props = {
  target: any;
  bottom?: boolean;
  shadow?: boolean;
  shadowCls?: string;
  close: () => void;
};

const prop = defineProps<Props>();
const context = ref();
const cords = computed(() => {
  var { x: target_x, y: target_y, width: target_width, height: target_height } = prop.target.getBoundingClientRect();
  var ctx_bcr = context.value?.getBoundingClientRect() ?? { width: 0, height: 0 };
  var ww = window.innerWidth;
  var wh = window.innerHeight;
  var top = prop.bottom ? target_y + target_height : target_y;
  var right = undefined;
  var bottom = undefined;
  var left = prop.bottom ? target_x : target_x + target_width;
  if ((left + ctx_bcr.width) >= ww) {
    console.log('[DEBUG] width overflow');
    left = undefined;
    right = ww - target_x;
  }
  if ((target_y + ctx_bcr.height) >= wh) {
    console.log('[DEBUG] height overflow');
    top = undefined;
    bottom = 0;
  }
  return {
    top: top ? `${top}px` : top,
    right: right ? `${right}px` : right,
    bottom: bottom ? `${bottom}px` : bottom,
    left: left ? `${left}px` : left,
  }
});
</script>

<template>
  <div
    ref="context"
    class="fixed"
    :style="cords"
  >
    <div
      :class="[
        'fixed inset-0 w-[100vw] h-[100vh]', {
        [ shadowCls || 'bg-black/[0.1]']: shadow
      }]"
      @click="close"
    />
    <div class="relative">
      <slot />
    </div>
  </div>
</template>
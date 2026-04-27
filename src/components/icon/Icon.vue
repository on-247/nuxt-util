<script lang="ts" setup>
import { type ComputedRef } from 'vue';
import { type SVGAttributes } from 'vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { onMounted } from 'vue';
import { useRuntimeConfig } from 'nuxt/app';
import helpCircle from './helpCircle.json';
import { useLogger } from '../../composables/debug';

const LOG = useLogger()

var icons = {};
var icon_path = useRuntimeConfig().public.icon_path
try {
  /** @ts-ignore */
  icons = await import(/* @vite-ignore */icon_path);
}
catch(e) {
  LOG.error(`Error encountered: ${String(e)}`);
  LOG.warn(`Icon template file at ${icon_path} could not be loaded`);
}

type Props = {
  name: string;
  viewBox?: string;
  sizes?: number | { width?: number, height?: number };
  stroke?: number;
  lineCap?: 'butt' | 'round' | 'square';
  lineJoin?: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round';
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  sizes: 16,
  stroke: 2,
  lineCap: 'round',
  lineJoin: 'round'
});

const mounted = ref(false);
const name = computed(() => props.name);
const color = computed(() => props.color);
const sizes = computed(() => props.sizes);
const template = computed(() => extractIconTemplate(icons, pascalCasize(name.value)));
const viewBox = computed(() => props.viewBox || template.value?.viewBox || '0 0 24 24');
const width = computed(() => {
  return 'number' === typeof sizes.value
    ? sizes.value
    : sizes.value?.width || template.value.defaultSizes?.width;
});
const height = computed(() => {
  return 'number' === typeof sizes.value
    ? sizes.value
    : sizes.value?.height || template.value.defaultSizes?.height;
});
const hasStroke = computed(() => typeof template.value.stroke !== 'undefined');
const fill = computed(() => !hasStroke.value
  ? normalizeCSSVar(color.value || template.value.defaultColor)
  : 'none');
const stroke = computed(() => hasStroke.value
  ? normalizeCSSVar(color.value || template.value.defaultColor)
  : 'none');
const attributes = computed(() => {
  return {
    xlmns: 'http://www.w3.org/2000/svg',
    viewBox: viewBox.value,
    width: width.value,
    height: height.value,
    ...(hasStroke.value ? {
        'stroke-width': props.stroke,
        'stroke-linecap': props.lineCap,
        'stroke-line-join': props.lineJoin}:{}),
    fill: fill.value,
    stroke: stroke.value,
    innerHTML: template.value.template.join('').trim()
  };
}) as ComputedRef<Partial<SVGAttributes>>;

const normalizeCSSVar = (str: string) => {
  return str.includes('--')
    ? `var(${str.replace(/(var)|\)|\(/g, '')})`
    : str;
}

const pascalCasize = (str: string) => {
  return str.split('').map((letter, idx, arr) => {
    return idx === 0
      ? letter.toUpperCase()
      : arr[idx - 1] === '-'
        ? letter.toUpperCase()
        : letter === '-'
          ? ''
          : letter;
  }).join('');
}

const extractIconTemplate = (module: any, name: string) => {
  let iconTemplate = module[name];
  return !iconTemplate ? helpCircle : iconTemplate;
}

onMounted(() => mounted.value = true);
</script>

<template>
  <div class="icon">
    <div
      :style="{
        width: `${width}px`,
        height: `${height}px`
      }"
    >
      <svg v-if="mounted" :="attributes"></svg>
    </div>
  </div>
</template>
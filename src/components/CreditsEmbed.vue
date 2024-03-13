<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'

interface Props {
    height?: number,
    theme?:
        | 'default'
        | 'white'
        | 'white-hc'
}

const prop = withDefaults(defineProps<Props>(), {height: 64})
const theme_ = computed(
    () => prop.theme
       || useRuntimeConfig().public?.creditTheme
       || 'default')
</script>

<template>
    <iframe
        loading="lazy"
        :src="`https://credit.on-247.nl?theme=${theme_}`"
        width="100%"
        :height="`${height}px`"
        frameborder="0"
    />
</template>
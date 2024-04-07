<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLazyload } from '../../composables/lazyload'

interface Emits {
    (e: 'loaded'): void
}

const emit = defineEmits<Emits>()
const lazyload = useLazyload()
const el = ref()

onMounted(() => {
    lazyload.listen(el.value, () => emit('loaded'))
})
</script>

<template>
    <img
        ref="el"
        class="lazy"
    />
</template>

<style scoped lang="scss">
img {
    opacity: 0;
    transition: all var(--lazyload-duration, .4s) var(--lazyload-easing, ease);
    &[data-ll-status="loaded"] {
        opacity: 1;
    }
}
</style>
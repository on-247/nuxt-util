<script setup lang="ts">
defineProps(['checked'])
</script>

<template>
    <div :class="['wrapper', checked ? 'checked' : null]">
        <div :class="['indicator', checked ? 'checked' : null]"></div>
    </div>
</template>

<style scoped lang="scss">
.wrapper {
    position: relative;
    width: var(--form-indicator-size, 1em);
    height: var(--form-indicator-size, 1em);
    border-radius: var(--form-indicator-roundness, 0.5em);
    border: 1px solid;
    border-color: var(--form-indicator-border-color, inherit);
    &.checked {
        border-color: var(--form-indicator-border-color-checked, inherit);
    }
}

.indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 80%;
    border-radius: var(--form-indicator-roundness, 0.5em);
    &.checked {
        background-color: var(--form-indicator-color, #000);
    }
}
</style>
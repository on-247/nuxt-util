<script setup lang="ts">
interface Props {
    forId?: string
    hide?: boolean
    floating?: boolean
    textarea?: boolean
}

withDefaults(
    defineProps<Props>(), {
    typing: false,
    floating: false    
})
</script>

<template>
    <label>
        <span
            :class="{ floating, textarea, hide }"
        >
            <slot />
        </span>
    </label>
</template>

<style scoped lang="scss">
label {
    position: absolute;
    width: 100%;
    height: 100%;
    inset: 0;
    pointer-events: none;
    color: var(--form-color);
}

span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: var(--form-spacing-x, 1em);
    &.textarea {
        top: var(--form-spacing-y, 1em);
        &:not(.hide) {
            transform: none;
        }
    }
    &.floating.hide {
        top: 0;
        font-size: 0.8em;
        background: var(--form-bg-color);
        padding: 0 5px;
    }
    &:not(.floating).hide {
        visibility: hidden;
    }
}
</style>
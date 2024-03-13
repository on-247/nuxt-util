<script setup lang="ts">
interface Props {
    icon?: string;
}

defineProps<Props>()
</script>

<template>
    <div class="error-help">
        <Icon
            v-if="icon"
            :name="icon"
            :sizes="13"
        />
        <span><slot /></span>
    </div>
</template>

<style scoped lang="scss">
.error-help {
    display: flex;
    gap: 0 .5em;
    padding: 0 0 0 var(--form-spacing-x, 1em);
    margin-top: .5em;
    font-size: var(--form-small-font-size, 0.8em);
    color: var(--form-helper-color);
    & :deep(> .icon) {
        color: var(--form-invalid-color);
    }
}
</style>
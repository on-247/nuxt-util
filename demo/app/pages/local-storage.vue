<script setup lang="ts">
const state = useLocalStorage()
const key = ref()
const value = ref()
const remove = (key: string) => {
    delete state[key]
}

// Testing reactivity
const isTestKeySet = computed(() => state.test)
</script>

<template>
    <p v-if="isTestKeySet">A test key was set</p>
    <div class="table">
        <div class="table-entry">
            <input v-model="key" placeholder="key" />
            <input v-model="value" placeholder="value" />
            <icon name="plus-circle" @click="state[key] = value" />
        </div>
        <div
            v-for="value, key in state"
            class="table-entry"
        >
            <span>{{ key }}</span>
            <input v-model="state[key]">
            <icon name="x" @click="remove(key)" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.table {
    display: flex;
    flex-direction: column;
    &-entry {
        display: flex;
        justify-content: space-between;
        gap: 20px;
    }
}
</style>
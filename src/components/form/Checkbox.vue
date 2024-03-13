<script setup lang="ts">
import {ref, computed, reactive} from 'vue';

import NativeCheckbox from './native/Checkbox.vue';
import Indicator from './Indicator.vue';
import ErrorHelp from './ErrorHelp.vue';

interface Emits {
    (e: 'update:modelValue', value: any): void;
}

interface Props {
    name: string;
    modelValue?: string;
    values: [string, string];
    required?: boolean;
    errorIcon?: string;
}

const emit = defineEmits<Emits>()
const prop = withDefaults(
    defineProps<Props>(), {
    modelValue: ''
})

const id = computed(() => `input-${(new Date).valueOf()}-${prop.name.toLowerCase().replace(/ |\-/gi, '_')}`)
const value = ref(prop.modelValue)
const state = reactive({
    checked: false,
    error: undefined
})

const onUpdateState = ({ checked, error }: any) => {
    state.checked = checked
    state.error = error
    emit('update:modelValue', value.value)
}
</script>

<template>
    <div>
        <label
            :for="id"
            class="field"
        >
            <slot
                name="indicator"
                :checked="state.checked"
            >
                <div><Indicator :checked="state.checked" /></div>
            </slot>
            <!--  -->
            <slot
                name="label"
                :checked="state.checked"
            >
                <slot />
            </slot>
        </label>
        <!--  -->
        <NativeCheckbox
            style="display:none;"
            v-model="value"
            :attributes="{
                id,
                name,
                values
            }"
            :validation="{
                required
            }"
            @update:state="onUpdateState"
        />
        <!--  -->
        <slot
            name="errorHelp"
            :error="state.error"
        >
            <ErrorHelp
                v-if="state.error"
                :icon="errorIcon"
            >
                {{state.error}}
            </ErrorHelp>
        </slot>
    </div>
</template>

<style scoped lang="scss">
.field {
    display: flex;
    align-items: center;
    gap: 0 var(--form-spacing-x, 1em);
    padding: 0 var(--form-spacing-x, 1em);
    cursor: pointer;
}

label {
    cursor: inherit;
    color: var(--form-invert-color);
}
</style>
<script setup lang="ts">
import {ref, computed, reactive, watch, onBeforeUnmount} from 'vue';

import NativeInput from './native/Input.vue';
import Label from './Label.vue';
import ErrorHelp from './ErrorHelp.vue';

interface Emits {
    (e: 'update:modelValue', value: any): void;
}

interface Props {
    name: string;
    modelValue?: any;
    type?: 'text' | 'number' | 'email' | 'tel' | 'date' | 'password';
    variant?: 'input' | 'textarea';
    required?: boolean;
    min?: number;
    max?: number;
    errorIcon?: string;
    floatingLabel?: boolean;
}

const emit = defineEmits<Emits>()
const prop = withDefaults(defineProps<Props>(), {
    type: 'text',
    variant: 'input',
    required: true,
    floatingLabel: true
})

const id = computed(() => `input-${(new Date).valueOf()}-${prop.name.toLowerCase().replace(/ |\-/gi, '_')}`)
const value = ref(prop.modelValue)
const state = reactive({
    filled: false,
    typing: false,
    error: undefined
})

const updateValue = (val: any) => {
    emit('update:modelValue', val)
    value.value = val
}

const onUpdateState = ({ filled, typing, error }: any) => {
    state.filled = filled
    state.typing = typing
    state.error = error
}

const stopWatchExternalValueChange = watch(
    () => prop.modelValue,
    externalValue => updateValue(externalValue)
)

const stopWatchUserValueChange = watch(
    value,
    userValue => updateValue(userValue)
)

onBeforeUnmount(() => {
    stopWatchExternalValueChange()
    stopWatchUserValueChange()
})
</script>

<template>
    <div>
        <div class="field">
            <slot name="input">
                <NativeInput
                    v-model="value"
                    :attributes="{
                        name,
                        id,
                        type,
                        variant
                    }"
                    :validation="{
                        required,
                        min,
                        max
                    }"
                    @update:state="onUpdateState"
                />
            </slot>
            <!--  -->
            <slot
                name="label"
                :typing="state.typing"
                :filled="state.filled"
            >
                <Label
                    :for-id="id"
                    :hide="state.filled || type === 'date'"
                    :textarea="variant == 'textarea'"
                    :floating="floatingLabel"
                >
                    <slot />
                </Label>
            </slot>
        </div>
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
    position: relative;
}

input,
textarea {
    width: 100%;
    padding: var(--form-spacing-y, 1em) var(--form-spacing-x, 1em);
    background-color: var(--form-bg-color);
    color: var(--form-color);
    border: 1px solid;
    border-color: var(--form-border-color);
    border-radius: var(--form-border-radius, 0.5em);
    outline: none;
    font-size: var(--form-font-size, 1em);
    font-family: inherit;
}

textarea {
    resize: vertical;
    font-family: inherit;
}

.is-validated input,
.is-validated textarea {
    &:valid {
        border-color: var(--form-valid-color);
    }
    &:invalid {
        border-color: var(--form-invalid-color);
    }
}
</style>
<script setup lang="ts">
import {ref, computed, reactive} from 'vue';

import Indicator from './Indicator.vue';
import Label from './Label.vue'
import ErrorHelp from './ErrorHelp.vue';

interface Emits {
    (e: 'update:modelValue', value?: string): void;
}

interface Props {
    name: string;
    modelValue?: string;
    radios: Radio[];
    multiple?: boolean;
    required?: boolean;
    errorIcon?: string;
}

type Radio = string | [string, string]

const emit = defineEmits<Emits>()
const prop = withDefaults(
    defineProps<Props>(), {
    modelValue: '',
    required: true
})

const splitValues = (values: string) => values.split(', ').map(v => v.trim()).filter(v => !!v)
const joinValues = (values: string[]) => values.join(', ')

const checkbox = ref()
const id = ref(`input-${(new Date).valueOf()}-${prop.name.toLowerCase().replace(/ |\-/gi, '_')}`)
const selection: Ref<string[]> = ref(splitValues(prop.modelValue))
const value = computed(() => joinValues(selection.value) || 'N.v.t.')
const state = reactive({
    error: undefined
})

const getValue = (radio: Radio) => typeof radio === 'string' ? radio : radio[0]
const getLabel = (radio: Radio) => typeof radio === 'string' ? radio : radio[1]

const onClick = (value: string) => {
    // Remove radio from selection
    if (selection.value.includes(value)) {
        selection.value = selection.value.filter(v => v !== value)
    }
    else {
        // Add radio to selection
        if (!prop.multiple) selection.value = []
        selection.value.push(value)
    }
    emit('update:modelValue', joinValues(selection.value))
}

const onHandleInvalid = (evt: any) => {
    state.error = evt.target.validationMessage
}

const stop = watch(
    () => prop.modelValue,
    () => {
        selection.value = splitValues(prop.modelValue)
        if (!selection.value.length && !state.error) state.error = checkbox.value.validationMessage
        if (selection.value.length && state.error) state.error = undefined
    }
)

onBeforeUnmount(() => stop())
</script>

<template>
    <div>
        <div
            :for="id"
            class="field"
        >
            <slot name="label">
                <Label
                    floating
                    textarea
                    hide
                >
                    <slot />
                </Label>
            </slot>
            <!--  -->
            <slot name="radios">
                <div class="radios">
                    <div
                        v-for="radio, index in radios"
                        :key="index"
                        @click="onClick(getValue(radio))"
                    >
                        <Indicator
                            :checked="selection.includes(getValue(radio))"
                        />
                        {{getLabel(radio)}}
                    </div>
                </div>
            </slot>
        </div>
        <!--  -->
        <input
            ref="checkbox"
            type="checkbox"
            style="display:none;"
            :id="id"
            :name="name"
            :checked="!!selection.length"
            :value="value"
            :required="required"
            @invalid="onHandleInvalid"
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
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--form-spacing-x, 1em) 0;
    padding: var(--form-spacing-y, 1em) var(--form-spacing-x, 1em);
    border: 1px solid;
    border-color: var(--form-border-color);
    border-radius: var(--form-border-radius, 0.5em);
    cursor: pointer;
}

.radios {
    display: flex;
    flex-direction: var(--form-radio-direction, column);
    gap: var(--form-spacing-y, 1.5em) var(--form-spacing-x, 1em);
    & > div {
        display: flex;
        gap: 0 var(--form-spacing-x, 1em);
        align-items: center;
    }
}

.error-help {
    display: flex;
    gap: 0 var(--form-spacing-x, 1em);
    padding: 0 0 0 var(--form-spacing-x, 1em);
    margin: var(--form-spacing-y, 1em) 0;
    font-size: var(--form-small-font-size, 0.8em);
    color: var(--form-helper-color);
    & :deep(> .icon) {
        color: var(--form-invalid-color);
    }
}
</style>
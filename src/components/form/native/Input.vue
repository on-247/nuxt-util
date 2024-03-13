<script setup lang="ts">
import {ref, computed, reactive, onMounted} from 'vue';

interface Emits {
    (e: 'update:modelValue', payload: any): void;
    (e: 'update:typing', payload: boolean): void;
    (e: 'update:filled', payload: boolean): void;
    (e: 'update:error', error?: string): void;
    (e: 'update:state', payload: State): void;
}

interface Props {
    modelValue?: string;
    typing?: boolean;
    filled?: boolean;
    error?: boolean;
    attributes: {
        name: string;
        id?: string;
        type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'password';
        variant?: 'input' | 'textarea';
    };
    validation?: {
        required?: boolean
        min?: number
        max?: number
    };
    state?: State;
}

interface State {
    filled: boolean;
    typing: boolean;
    error?: string;
}

const emit = defineEmits<Emits>()
const prop = withDefaults(
    defineProps<Props>(), {
    typing: false,
    filled: false,
    error: false,
    attributes: () => ({
        name: '',
        id: undefined,
        type: 'text',
        variant: 'input'
    }),
    validation: () => ({
        required: true,
        min: undefined,
        max: undefined
    })
})

const getVariant = computed(() => prop.attributes?.variant || 'input')
const value = ref(prop.modelValue)
const isFilled = ref(!!prop.modelValue)
const isTyping = ref(prop.typing)
const validationMessage = ref(undefined)
const state: State = reactive({
    filled: isFilled,
    typing: isTyping,
    error: validationMessage
})

const onHandleFocus = (evt: any) => {
    isTyping.value = true
    evt.target.reportValidity()
    // We want to report validity the native way when the user is typing
    if (validationMessage.value) {
        validationMessage.value = undefined
    }
}

const onHandleInput = (evt: any) => {
    value.value = evt.target.value
    isFilled.value = !!evt.target.value
    emitAll()
}

const onHandleBlur = (evt: any) => {
    isTyping.value = false
    // We want to add non-native validation report when not typing
    if (! evt.target.checkValidity()) {
        validationMessage.value = evt.target.validationMessage
    }
}

const onHandleInvalid = (evt: any) => {
    if (! isTyping.value) {
        validationMessage.value = evt.target.validationMessage
        emit('update:state', state)
    }
}

const emitAll = () => {
    emit('update:modelValue', value.value)
    emit('update:state', state)
    emit('update:typing', isTyping.value)
    emit('update:filled', isFilled.value)
    emit('update:error', validationMessage.value)
}

onMounted(() => emitAll())
</script>

<template>
    <component
        :is="getVariant"

        :type="attributes.type"
        :id="attributes.id"
        :name="attributes.name"
        :value="value"

        :required="validation.required"
        :min="validation.min"
        :max="validation.max"

        @focus="onHandleFocus"
        @input="onHandleInput"
        @blur="onHandleBlur"
        @invalid="onHandleInvalid"
    />
</template>
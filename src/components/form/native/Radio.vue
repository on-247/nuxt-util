<script setup lang="ts">
import {
    ref,
    reactive,
    watch,
    onMounted,
    onBeforeUnmount
} from 'vue';

interface Emits {
    (e: 'update:modelValue', payload: any): void;
    (e: 'update:checked', payload: boolean): void;
    (e: 'update:error', error?: string): void;
    (e: 'update:state', payload: State): void;
}

interface Props {
    modelValue: string;
    checked?: boolean;
    error?: boolean;
    attributes: {
        name: string
        id?: string
        value: string
    };
    validation?: {
        required?: boolean
    };
    state?: State;
}

interface State {
    checked: boolean;
    error?: string;
}

const emit = defineEmits<Emits>()

const prop = withDefaults(
    defineProps<Props>(), {
    checked: false,
    error: false,
    attributes: () => ({
        name: '',
        id: undefined,
        value: '',
        multiple: false
    }),
    validation: () => ({
        required: true
    })
})

const checked = ref(false)
const radio = ref(prop.modelValue)
const validationMessage = ref(undefined)
const state: State = reactive({
    checked: checked,
    error: validationMessage
})

const onHandleChange = (evt: any) => {
    checked.value = evt.target.checked
    if (evt.target.reportValidity() && validationMessage.value) {
        validationMessage.value = undefined
    }
    emitAll()
}

const onHandleInvalid = (evt: any) => {
    validationMessage.value = evt.target.validationMessage
    emitAll()
}

const emitAll = () => {
    emit('update:modelValue', radio.value)
    emit('update:state', state)
    emit('update:checked', checked.value)
    emit('update:error', validationMessage.value)
}

const stopWatchChecked = watch(
    () => prop.checked,
    (val) => checked.value = val
)

onMounted(() => {
    if (radio.value === prop.attributes.value) {
        checked.value = true
    }
    emitAll()
})

onBeforeUnmount(() => stopWatchChecked())
</script>

<template>
    <input
        type="radio"

        v-model="radio"

        :id="attributes?.id"
        :name="attributes.name"
        :value="attributes.value"

        :required="validation.required"

        @change="onHandleChange"
        @invalid="onHandleInvalid"
    />
</template> 
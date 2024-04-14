<style>
:root {
    --form-border-radius: 0;
    --form-indicator-roundness: 0;
    --form-bg-color: white;
    --form-border-color: black;
    --form-helper-color: gray;
    --form-invalid-color: red;
    --form-indicator-color: orange;
    --form-indicator-border-color: purple;
    --form-indicator-border-color-checked: orange;
}
</style>

<script setup lang="ts">
const breakpoint = useBreakpoint()

const formData = ref(new FormData)
const fields = reactive({
    name: null,
    email: null,
    drink: undefined,
    meals: 'Coca Cola',
    general: undefined
})

const screen = reactive({
    small: breakpoint.between(null, 'md'),
    medium: breakpoint.between('md', 'lg'),
    large: breakpoint.between('lg', null),
})

onBeforeUnmount(() => stop())
</script>

<template>
    <Form
        submit-label="Submit"
        loading-label="Submitting..."
        @submit="(fd: FormData) => formData = fd"
    >
        <FormInput
            name="date"
            type="date"
            error-icon="alert-triangle"
            :required="false"
        >
            Datum
        </FormInput>
        <FormInput
            v-model="fields.name"
            name="name"
            :min="3"
            error-icon="alert-triangle"
        >
            Your name
        </FormInput>
        <FormInput
            name="email"
            type="email"
            error-icon="alert-triangle"
        >
            Your e-mail
        </FormInput>
        <FormInput
            name="info"
            variant="textarea"
            :max="300"
            :required="false"
            error-icon="alert-triangle"
        >
            Optional info
        </FormInput>
        <FormRadio
            v-model="fields.drink"
            name="drink"
            :radios="[
                'Coca Cola',
                ['capri-sun', 'Capri Sun'],
                'Gatoraid'
            ]"
            error-icon="alert-triangle"
            required
        >
            What drink would you like?
        </FormRadio>
        <FormRadio
            v-model="fields.meals"
            name="meals"
            :radios="[
                'Coca Cola',
                ['capri-sun', 'Capri Sun'],
                'Gatoraid'
            ]"
            multiple
            error-icon="alert-triangle"
            required
        >
            What meal(s) whould you like?
        </FormRadio>
        <FormCheckbox
            v-model="fields.general"
            name="general"
            :values="['Ja', 'Nee']"
            error-icon="alert-triangle"
            required
        >
            <div>
                <b>Ik ga akkoord met de algemene voorwaarden.</b>
                <br>
                <span style="font-size:0.8em;">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</span>
            </div>
        </FormCheckbox>
    </Form>
    <!--  -->
    <pre v-if="[...formData.entries()].length">
        {{ JSON.stringify(Object.fromEntries(formData.entries())) }}
    </pre>
</template>
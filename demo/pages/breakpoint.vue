<template>
    <p>Currently: {{ $breakpoint.current }} (Resize the window) </p>
    <p v-if="$breakpoint.current.value === 'lg'">Show v-if current === lg</p>
    <p>Between xs and md? {{ $breakpoint.between('xs', 'md') }}</p>
    <icon
        v-if="$breakpoint.between('xs', 'md')"
        name="x"
        :sizes="60"
    />
    <p>Is md? {{ $breakpoint.is('md') }}</p>
    <icon
        v-if="$breakpoint.is('md')"
        name="x"
        :sizes="60"
    />
</template>
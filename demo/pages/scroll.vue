<script setup lang="ts">
const scroll = useScroll()
const { up, down } = useScrollDirection()

const stats = reactive({
    speed: 0,
    progress: 0
})

scroll.scroll(({ speed, progress }) => {
    stats.speed = speed
    stats.progress = progress
})

onMounted(() => {
    scroll.init()
})
</script>

<template>
    <header
        :style="{
            position: 'fixed',
            width: '100%',
            height: '80px',
            top: '40px',
            left: '0',
            right: '0',
            background: 'purple',
            transition: '.4s ease',
            transform: down ? 'translatey(-120px)' : 'translatey(0)'
        }"
    />
    <section
        style="min-height: 200vh"
    >

        <span style="position:fixed;top:120px;left:0;">Up: {{ up }} | Down: {{ down }}</span>
        <span style="position:fixed;top:140px;left:0;">Speed: {{ stats.speed }}</span>
        <span style="position:fixed;top:160px;left:0;">Progress: {{ stats.progress }}</span>

    </section>
</template>
<template>
    <header style="padding:20px;">
        <nav :class="['flex', {'is-mobile': $breakpoint.between('xs', 'md')}]">
            <router-link to="/" style="display: block;">Home</router-link>
            <router-link to="/breakpoint" style="display: block;">Breakpoint</router-link>
            <router-link to="/local-storage" style="display: block;">Local storage</router-link>
            <router-link to="/browser" style="display: block;">Browser detect</router-link>
            <router-link to="/lazyload" style="display: block;">Lazyload</router-link>
            <router-link to="/scroll" style="display: block;">Scroll</router-link>
            <router-link to="/captcha" style="display: block;">Captcha</router-link>
            <router-link to="/credit" style="display: block;">Credit</router-link>
            <router-link to="/form" style="display: block;">Form</router-link>
        </nav>
    </header>
</template>

<style scoped lang="scss">
header {
    margin-bottom: 50px;
}
nav {
    &.flex {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }
    &.is-mobile {
        flex-direction: column;
    }
}
.router-link-active {
    color: green;
}
</style>
<script setup lang="ts">
</script>

<template>
  <header style="padding:20px;">
    <div :style="{display: 'flex', alignItems: 'center', marginBottom: '2rem'}">
      <div class="flex flex-col">
        <div>Light</div>
        <div>up&lt;it&lt;</div>
        <div>.store</div>
      </div>
      <ImageLazy
        data-src="/logo-anim.gif"
        height="64"
      />
    </div>
    <nav :class="['flex', {'is-mobile': $breakpoint.between('xs', 'md')}]">
      <router-link to="/" style="display: block;">Home</router-link>
      <router-link to="/modal" style="display: block;">Modal</router-link>
      <router-link to="/lazyload" style="display: block;">Lazyload</router-link>
      <router-link to="/local-storage" style="display: block;">Local storage</router-link>
      <router-link to="/breakpoint" style="display: block;">Breakpoint</router-link>
      <router-link to="/form" style="display: block;">Form</router-link>
      <router-link to="/captcha" style="display: block;">Captcha</router-link>
      <router-link to="/browser" style="display: block;">Browser detect</router-link>
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
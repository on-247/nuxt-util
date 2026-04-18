<template>
  <ClientOnly>
    <Header />
    <main style="padding:0 20px;">
      <NuxtPage />
    </main>
    <Footer />
  </ClientOnly>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700&display=swap');

html,
body,
#__nuxt {
  width: 100%;
  height: 100%;
  font-family: 'Inter';
}
</style>
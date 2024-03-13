<template>
    <ClientOnly>
        <Header />
        <main style="padding:0 20px;">
            <slot />
        </main>
        <Footer />
    </ClientOnly>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;700&display=swap');

* {
    box-sizing: border-box;
    margin: 0;
}

body {
    font-family: 'Inter';
}
</style>
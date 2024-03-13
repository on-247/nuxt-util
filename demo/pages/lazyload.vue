<script setup lang="ts">
const state = reactive({

})

const alert = (message: string) => window.alert(message)

onMounted(() => {
    useLazyload().lazyload.update()
})
</script>

<template>
    <p>Scroll to bottom</p>
    <div style="margin-top:200vh;" />
    <image-lazy
        data-src="https://cfl.dropboxstatic.com/static/images/logo_catalog/blue_dropbox_glyph_m1-vflZvZxbS.png"
    />
    <video-lazy
        style="width:100%;"
        autoplay
        muted
        playsinline
        loop
        data-poster="https://user-images.githubusercontent.com/209129/173065853-77b26be2-dd15-4b4d-8164-850e70247b88.png"
    >
        <source
            type="video/mp4"
            data-src="https://aem.dropbox.com/cms/content/dam/dropbox/warp/en-us/dropbox/Dropbox_Homepage.mp4"
        />
    </video-lazy>
</template>
import { ref } from 'vue'
import { Scroll, type ScrollOptions } from '../lib/scroll'

var instance: Scroll

export const useScroll = (options?: ScrollOptions) => {
    if(!instance || typeof options !== 'undefined') {
        instance = new Scroll(options)
    }
    return instance
}

export const useScrollDirection = () => {
    const up = ref(false)
    const down = ref(false)
    const scroll = useScroll()
    scroll.up(() => (up.value = true, down.value = false))
    scroll.down(() => (up.value = false, down.value = true))
    return { up, down }
}
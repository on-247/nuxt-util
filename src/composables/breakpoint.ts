import { computed } from 'vue'
import { useThrottle } from './performance'
import { isClient } from '../lib/util'
import {
    type Breakpoint,
    type RangeArgs,
    ww,
    getBreakpoint,
    currentBreakpoint,
    is,
    between
} from '../lib/breakpoint'

var isListeningForResize = false

const resizeListener = useThrottle((evt: any) => {
    ww.value = window.innerWidth
    currentBreakpoint.value = getBreakpoint()
}, 100)

export const useBreakpoint = () => {
    if (isClient && !isListeningForResize) {
        window.addEventListener('resize', resizeListener)
        isListeningForResize = true
    }

    return {
        current: currentBreakpoint,
        is: (assertion: Breakpoint) => computed(() => is(assertion)),
        between: (...args: RangeArgs) => computed(() => between(...args))
    }
}
import { ref, type Ref} from 'vue'
import { isClient } from '../util'

/** Breakpoints */
export type Breakpoint =
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'

/** Arguments needed for creating a getter for a range of breakpoints */
export type RangeArgs = [Breakpoint | null, Breakpoint | null]

/**
 * Breakpoints and starting values (based on TailwindCSS media query
 * breakpoints)
 * */
const breakpointWidths: Record<Breakpoint, number> = {
    'xs': 0,
    'sm': 640,
    'md': 768,
    'lg': 1024,
    'xl': 1280,
    '2xl': 1536
}

export const ww = ref(isClient ? window.innerWidth : breakpointWidths.xl)

/** Reads the current breakpoint from the document's body psuedo CSS value */
export const getBreakpoint = () => {
    if (!isClient) return 'xl'

    let currentBreakpoint = window.getComputedStyle(
        document.body,
        '::before'
    ).content.replace(/\"/g, '') as Breakpoint

    return currentBreakpoint
}

export const currentBreakpoint: Ref<Breakpoint> = ref(getBreakpoint())

/**
 * Checks wheter the current window is past given breakpoint but not exceeding
 * the next one.
 */
export const is = (assertion: Breakpoint) => {
    if (!isClient) return false
    return assertion === currentBreakpoint.value
}

/**
 * Checks wheter the current window width ranges between to given breakpoints.
 */
export const between = (
    assertion: Breakpoint | null,
    assertion2: Breakpoint | null
) => {
    if (!isClient) return false

    let min = assertion ? breakpointWidths[assertion]: 0,
        max = assertion2 ? breakpointWidths[assertion2] : Infinity

    return ww.value >= min && ww.value < max
}
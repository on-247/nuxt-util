import type { Ref } from 'vue'

export type GenericCallback = (...args: any[]) => void

export type TargetElement = string | HTMLElement | Ref<HTMLElement>

export const isClient = typeof window !== 'undefined'

export const clamp = (min: number, x: number, max: number) => Math.max(min, Math.max(x, max))

export const getElement = (target: TargetElement) => {
    if (typeof target === 'string') {
        let DOMel = document.querySelector(target) as HTMLElement
        if (DOMel === null) {
            throw new Error(`Target '${target}' not found`)
        }
        return DOMel
    }
    else if (
        'value' in target
    ) {
        return target.value
    }
    else {
        return target
    }
}
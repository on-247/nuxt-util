import tempus from '../lib/tempus'
import type { GenericCallback } from '../lib/util'


export const useTempus = (callback: GenericCallback, priority = 0) => {
    if (!tempus) return (() => {})
    return tempus.add(callback, priority)
}

export const useRemoveTempus = (callback: GenericCallback) => {
    if (!tempus) return
    tempus.remove(callback)
}

export const useThrottle = (
    callback: GenericCallback,
    wait: number
): GenericCallback => 
{
    if (typeof window === 'undefined') {
        return (() => {})
    }

    var isThrottling = false;
    return (...args: any[]) => {
        if (!isThrottling) {
            callback.call(null, ...args)
            isThrottling = true
            setTimeout(() => isThrottling = false, wait)
        }
    }
}

export const useDebounce = (
    callback: GenericCallback,
    wait: number
): GenericCallback =>
{
    if (typeof window === 'undefined') {
        return (() => {})
    }

    let timeoutId = 0
    return (...args: any[]) => {
        window.clearTimeout(timeoutId)
        timeoutId = window.setTimeout(() => {
            callback.call(null, ...args)
        }, wait)
    }
}
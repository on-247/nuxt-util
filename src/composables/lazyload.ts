import { Lazy } from '../lib/lazyload'

var instance: Lazy

export const useLazyload = () => {
    if (!instance) {
        instance = Lazy.withCallback()
    }
    return instance
}
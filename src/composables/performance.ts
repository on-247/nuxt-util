import NBTimer from '../lib/nbtimer'
import type { GenericCallback } from '../lib/util'


export const useNBTimer = (cb: GenericCallback, options: any) => {
  if (!NBTimer) return (() => {})
  return NBTimer.add(cb, options)
}

export const useNBTimerUnsubscribe = (id: string) => {
  if (!NBTimer) return
  NBTimer.remove(id)
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
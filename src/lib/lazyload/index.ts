import LazyLoad from 'vanilla-lazyload'
import { isClient, type GenericCallback } from '../util'

type Listener = { el: HTMLElement; callback: GenericCallback}
type UnsubscribeCallback = () => void


class NodeLazyload {
  listen() {}
}

export class Lazy {
  lazyload: any
  listeners: Listener[]

  constructor() {
    this.lazyload = null
    this.listeners = []
  }

  static withCallback() {
    let instance = new this()
    let options: Record<string, any> = {}

    options.unobserve_entered = true
    options.callback_enter = instance.enterCallback.bind(instance)
    options.use_native = true

    instance.lazyload = isClient ? new LazyLoad(options) : new NodeLazyload()
    return instance
  }

  listen(el: HTMLElement, callback: GenericCallback): UnsubscribeCallback {
    this.listeners.push({el, callback})
    /** @NOTE do not pass in the html element, will break */
    this.lazyload.update()
    return () => this.removeListener(el)
  }

  private enterCallback(loadedEl: Element) {
    for (let {el, callback} of this.listeners) {
      if(el === loadedEl) {
        callback()
        this.removeListener(el)
        break;
      }
    }
  }

  private removeListener(loadedEl: Element) {
    this.listeners = this.listeners.filter(({el}) => el !== loadedEl)
  }
}
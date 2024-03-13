import Lenis from '@studio-freight/lenis'
import Tempus from '../tempus'
import {
    type GenericCallback,
    type TargetElement,
    getElement
} from '../util'
import { Intersect } from './intersect'

type ScrollUpValue = -1
type ScrollDownValue = 1

interface LenisScrollValues {
    /**
     * Amount scrolled on the y-axis in pixels.
     */
    scroll: number
    /**
     * Maximum amount the user can scroll on the y-axis in pixels.
     */
    limit: number
    /**
     * Decimal between 0 and 1 representing the percentage of how
     * much the user has scrolled based on 'scroll' and 'limit'.
     */
    progress: number
    /**
     * Speed of scrolling.
     */
    velocity: number
    /**
     * Represents the direction in which the user is scrolling.
     */
    direction: ScrollUpValue | ScrollDownValue
}

interface ScrollValues {
    /**
     * Amount scrolled on the y-axis in pixels.
     */
    y: number
    /**
     * Maximum amount the user can scroll on the y-axis in pixels.
     */
    limit: number
    /**
     * Decimal between 0 and 1 representing the percentage of how
     * much the user has scrolled based on 'scroll' and 'limit'.
     */
    progress: number
    /**
     * Speed of scrolling.
     */
    speed: number
    /**
     * Represents the direction in which the user is scrolling.
     */
    orientation: ScrollUpValue | ScrollDownValue
}

type LenisScrollCallback = ((values: LenisScrollValues) => void)
type ScrollCallback = ((values: ScrollValues) => void)
type UnsubscribeCallback = (() => void)

type ScrollListeners = ScrollCallback[]

type ScrollOrientation =
    | 'up'
    | 'down'

type ScrollOrientationListeners = Record<
    ScrollOrientation,
    ScrollListeners
>

export interface ScrollOptions {
    wrapper?: HTMLElement | Window
    container?: TargetElement
    wheel?: boolean | number
    touch?: boolean | number
    syncTouch?: boolean
    easing?: ((t: number) => number)
    lerp?: number
}


export class Scroll
{
    options: ScrollOptions
    public lenis: Lenis | null
    private scrollListeners: ScrollListeners
    private orientationListeners: ScrollOrientationListeners

    /**  A callback that stops requesting animation frames. */
    private killRAF?: UnsubscribeCallback

    constructor(options?: ScrollOptions) {
        this.options = options || {}
        this.lenis = null
        this.scrollListeners = []
        this.orientationListeners = {
            up: [],
            down: []
        }
    }

    /**
     * Initialise the scroll instance, creating a Lenis instance
     * and passing it if given, options and finanlly starting the
     * scroll by requesting animation frames for scrolling.
     */
    public init() {
        if (this.lenis !== null) {
            return
        }

        // Lenis specific options
        const wrapper = this.options?.wrapper
        const content = this.options?.container
            ? getElement(this.options.container) : undefined
        const smoothWheel = !!(this.options?.wheel ?? true)
        const smoothTouch = !!this.options?.touch
        const wheelMultiplier = typeof this.options.wheel === 'number'
            ? this.options.wheel : 1
        const touchMultiplier = typeof this.options.touch === 'number'
            ? this.options.touch : 4
        const easing = this.options?.easing
        const lerp = easing ? 0 : (this.options?.lerp ?? 0.1)

        this.lenis = new Lenis({
            wrapper,
            content,
            smoothWheel,
            smoothTouch,
            syncTouch: this.options?.syncTouch,
            wheelMultiplier,
            touchMultiplier,
            easing,
            lerp
        })

        this.lenis.on('scroll', this.onScroll.bind(this))

        this.createRAF()
    }

    private onScroll: LenisScrollCallback = (values) => {
        const orientation = values.direction == -1 ? 'up' : 'down'
        const scrollValues = {
            y: values.scroll,
            limit: values.limit,
            progress: values.progress,
            speed: values.velocity,
            orientation: values.direction
        }

        let allScrollListeners = [
            ...this.scrollListeners,
            ...this.orientationListeners[orientation],
        ]

        for(let callback of allScrollListeners) {
            callback.call(null, scrollValues)
        }
    }

    /**
     * Create a request animation frame callback with the highest priority for
     * Lenis. If Tempus can not be used meaning the runtime is serverside, skip.
     * (Tempus is dependent on the Window object)
     */
    private createRAF() {
        if (Tempus && !this.killRAF) {
            this.killRAF = Tempus.add((time: number) => {
                this?.lenis?.raf(time)
            }, 0)
        }
    }

    public pause() {
        this?.lenis?.stop()
    }

    public start() {
        this?.lenis?.start()
    }

    public destroy() {
        this.killRAF?.call(null)
        this.lenis?.destroy()
        this.lenis = null
        this.scrollListeners = []
        this.orientationListeners = {
            up: [],
            down: []
        }
    }

    /**
     * Smooth scroll to given target, target being either a number indicating
     * amount of pixels, a string that identifies a DOM element or a Ref that
     * points to a DOM element.
     */
    public to(target: TargetElement | number) {
        if ('number' !== typeof target) target = getElement(target)
        this.lenis?.scrollTo(target)
    }

    public scroll(callback: ScrollCallback) {
        this.scrollListeners.push(callback)
        return () => this.removeListener(callback)
    }

    public up(callback: ScrollCallback): UnsubscribeCallback
    {
        this.orientationListeners.up.push(callback)
        return () => this.removeOrienationListener('up', callback)
    }

    public down(callback: ScrollCallback): UnsubscribeCallback
    {
        this.orientationListeners.down.push(callback)
        return () => this.removeOrienationListener('down', callback)
    }

    private removeListener(callback: GenericCallback) {
        this.scrollListeners = this.scrollListeners
        .filter(
            cb => callback !== cb
        )
    }

    private removeOrienationListener(
        orientation: ScrollOrientation,
        callback: GenericCallback
    ) {
        this.orientationListeners[orientation] = this.orientationListeners[orientation]
        .filter(
            cb => callback !== cb
        )
    }

    /**
     * Register a scroll intersection for given element.
     * Setting a treshold is not recommended.
     */
    public intersect(el: TargetElement, treshold = 0) {
        return new Intersect(getElement(el), treshold)
    }
}
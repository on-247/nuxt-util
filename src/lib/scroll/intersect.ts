import Tempus from '../tempus'
import { type GenericCallback, clamp } from '../util'

interface IntersectProgressValues {
    /** Total progress amount. */
    amount: number
    /** Progress from when element is entering the viewport. */
    entering: number
    /**
     * Progress from when element has entered the viewport until it's about
     * to leave the viewport.
     * */
    walking: number
    /** Progress from when element is leaving the viewport. */
    leaving: number
}

interface IntersectIndividualProgressValues {
    amount: number
    el: HTMLElement
    rect: DOMRect
}

type IntersectProgressCallback <T> = ((values: T) => void)

type IntersectIndividualCallbackTypes =
    | 'entering'
    | 'entered'
    | 'walking'
    | 'leave'
    | 'leaving'

type IntersectIndividualCallacks = Record<
    IntersectIndividualCallbackTypes,
    IntersectProgressCallback<IntersectIndividualProgressValues>
>

interface IntersectCallbacks extends Partial<IntersectIndividualCallacks> {
    progress?: IntersectProgressCallback<IntersectProgressValues>
    enter?: IntersectProgressCallback<any>
    left?: IntersectProgressCallback<any>
}

type UnsubscribeCallback = (() => void)


class Progress {
    /** DOMRect.top */
    top: number

    /** DOMRect.bottom */
    bottom: number

    /** DOMRect.height */
    height: number

    constructor(top: number, bottom: number, height: number) {
        this.top = top
        this.bottom = bottom
        this.height = height
    }

    /** Progress from when entering until fully leaving the viewport */
    get amount() {
        // Because DOMRect.top is a negative number. We also want to record
        // progress when the element enters the viewport rather than when it
        // hits the top of the viewport so we add the height of the viewport
        // since DOMRect.top is relative to the top of the viewport.
        let entered = this.top * -1 + this.wh
        let height = this.height + this.wh
        let isVisible = this.enteringAmount >= 0.01

        return isVisible ? clamp(0, entered/height, 1) : 0
    }

    /** Progress to when fully entered viewport */
    get enteringAmount() {
        let entered = this.wh - this.top

        return clamp(0, entered/this.wh, 1)
    }

    /**
     * Progress from when entered the viewport to when leaving
     * viewport.
     */
    get walkingAmount() {
        let hasEntered = this.enteringAmount >= 1
        let hasNotLeft = this.leavingAmount <= 1

        if (hasEntered && hasNotLeft) {
            // Because DOMRect.top is a negative number here
            let top = this.top * -1
            let progress = top / (this.height - this.wh)

            // If the amount of pixels to leave and enter the
            // element is the same 'top' and 'progress' both become
            // zero at this point leading to a returning value of
            // NaN.
            if (this.height - this.wh == 0) {
                return 1
            }

            return clamp(0, progress, 1)
        } else {
            // If the element has not fully entered or left the
            // viewport yet, return 1 or 0 based on if the element
            // has fully entered the viewport.
            return hasEntered ? 1 : 0
        }
    }

    /** Progress to when fully left viewport */
    get leavingAmount() {
        let notLeft = this.wh - this.bottom

        return clamp(0, notLeft/this.wh, 1)
    }

    get wh() {
        return window.innerHeight
    }

    updateRect(rect: DOMRect) {
        this.top = rect.top
        this.bottom = rect.bottom
        this.height = rect.height
    }
}

export class Intersect {
    /** Target to observe. */
    public readonly target: HTMLElement

    /** Intersection observer observing the target. */
    public readonly observer: IntersectionObserver

    /**
     * Lazily create Progress instance for when only enter/leave
     * callbacks are used. Micro performance optimization.
     */
    private lazy_progress?: Progress

    /** Progress callbacks. */
    public readonly callbacks: IntersectCallbacks

    /**
     * Savepoints for callbacks that only need invocation once but
     * can't rely on native APIs like the 'enter' and 'leave' callback.
     */
    private callbackSavepoints: {
        entered: boolean
        leave: boolean
    }

    /**
     * Indicates that progress is being tracked, meaning progress
     * callbacks can and are being invoked per RAF. (request animation
     * frame).
     * 
     * This boolean is only mutated when the observer callback is
     * invoked (either intersecting or not) and ensures that invoking
     * the callbacks should happen only one time per RAF.
     */
    private isTrackingProgress: boolean

    /**
     * Stops requesting animation frames to invoke progress callbacks.
     */
    private killRAF?: GenericCallback

    constructor(el: HTMLElement, treshold: number) {
        this.target = el
        this.observer = new IntersectionObserver(
            this.observerCallback.bind(this), {
                root: null,
                threshold: treshold
            }
        )

        this.callbacks = {}
        this.callbackSavepoints = {
            entered: false,
            leave: false
        }
        this.isTrackingProgress = false

        this.observer.observe(el)
    }

    private get _progress() {
        if (!this.lazy_progress) {
            let rect = this.target.getBoundingClientRect()
            this.lazy_progress = new Progress(
                rect.top, rect.bottom, rect.height
            )
        }

        return this.lazy_progress
    }

    private observerCallback: IntersectionObserverCallback = (
        entries,
        _
    ) => {
        entries.forEach((entry) => {
            if (!Tempus) return

            if (entry.isIntersecting) this.isIntersecting(entry)
            else this.isNotIntersecting(entry)
        })
    }

    private isIntersecting(entry: IntersectionObserverEntry) {
        this.callbacks?.enter?.call(null, [])

        if (Tempus && !this.isTrackingProgress) {
            this.isTrackingProgress = true

            // Create request animation frame callback
            this.killRAF = Tempus.add(this.invokeCallbacks.bind(this), 1)
        }
    }

    /**
     * @TODO this function is to large and also the callbacks being
     * invoked like this with conditionals all over the place is not
     * a good thing altought it works just fine. Maybe create another
     * class that decides when to invoke progress callbacks?
     */
    private invokeCallbacks() {
        this._progress.updateRect(this.target.getBoundingClientRect())

        this.callbacks?.progress?.call(null, {
            amount: this._progress.amount,
            entering: this._progress.enteringAmount,
            walking: this._progress.walkingAmount,
            leaving: this._progress.leavingAmount
        })

        const individualCallbackValues = (amount: number) => ({
            amount,
            el: this.target,
            rect: this.target.getBoundingClientRect()
        })

        // Entering callback
        if (
            this._progress.enteringAmount <= 1 &&
            this._progress.walkingAmount <= 0
        ) {
            this.callbacks?.entering?.call(
                null,
                individualCallbackValues(
                    this._progress.enteringAmount
                )
            )
        }

        if (
            this._progress.enteringAmount >= 1 &&
            this._progress.walkingAmount <= 1 &&
            this._progress.leavingAmount <= 0
        ) {
            // Entered callback
            if (!this.callbackSavepoints.entered) {
                this.callbackSavepoints.entered = true
                this.callbacks?.entered?.call(
                    null,
                    individualCallbackValues(
                        this._progress.amount
                    )
                )
            }

            // Walking callback
            this.callbacks?.walking?.call(
                null,
                individualCallbackValues(
                    this._progress.walkingAmount
                )
            )
        }

        if (
            this._progress.walkingAmount >= 1 &&
            this._progress.leavingAmount <= 1
        ) {
            // Leave callback
            if (!this.callbackSavepoints.leave) {
                this.callbackSavepoints.leave = true
                this.callbacks?.leave?.call(
                    null,
                    individualCallbackValues(
                        this._progress.amount
                    )
                )
            }

            // Leaving callback
            this.callbacks?.leaving?.call(
                null,
                individualCallbackValues(
                    this._progress.leavingAmount
                )
            )
        }
    }

    private isNotIntersecting(entry: IntersectionObserverEntry) {
        this.callbacks?.left?.call(null, [])

        // If progress is currently being tracked,
        // stop tracking it for performance reasons.
        if (this.isTrackingProgress) {
            // Remove request animation frame callback.
            this.killRAF?.call(null)
            // Reset savepoints for callbacks that are only invoked
            // one time.
            this.resetCallbackSavepoints(['entered', 'leave'])
            // So RAF can be requested again when target is intersecting
            // viewport.
            this.isTrackingProgress = false
        }
    }

    private resetCallbackSavepoints(types: ('entered' | 'leave')[]) {
        types.forEach(this.resetCallbackSavepoint.bind(this))
    }

    private resetCallbackSavepoint(type: 'entered' | 'leave') {
        this.callbackSavepoints[type] = false
    }

    progress(
        callback: IntersectProgressCallback<IntersectProgressValues>
    ): UnsubscribeCallback
    {
        this.addCallback('progress', callback)
        return () => this.removeCallback('progress')
    }

    enter(
        callback: IntersectProgressCallback<
            IntersectIndividualProgressValues
        >
    ): UnsubscribeCallback
    {
        this.addCallback('enter', callback)
        return () => this.removeCallback('enter')
    }

    entering(
        callback: IntersectProgressCallback<
            IntersectIndividualProgressValues
        >
    ): UnsubscribeCallback
    {
        this.addCallback('entering', callback)
        return () => this.removeCallback('entering')
    }

    entered(
        callback: IntersectProgressCallback<
            IntersectIndividualProgressValues
        >
    ): UnsubscribeCallback
    {
        this.addCallback('entered', callback)
        return () => this.removeCallback('entered')
    }

    walking(
        callback: IntersectProgressCallback<
            IntersectIndividualProgressValues
        >
    ): UnsubscribeCallback
    {
        this.addCallback('walking', callback)
        return () => this.removeCallback('walking')
    }

    leave(
        callback: IntersectProgressCallback<
            IntersectIndividualProgressValues
        >
    ): UnsubscribeCallback
    {
        this.addCallback('leave', callback)
        return () => this.removeCallback('leave')
    }

    leaving(
        callback: IntersectProgressCallback<
            IntersectIndividualProgressValues
        >
    ): UnsubscribeCallback
    {
        this.addCallback('leaving', callback)
        return () => this.removeCallback('leaving')
    }

    left(
        callback: IntersectProgressCallback<
            IntersectIndividualProgressValues
        >
    ): UnsubscribeCallback
    {
        this.addCallback('left', callback)
        return () => this.removeCallback('left')
    }

    destroy() {
        this.killRAF?.call(null)
        this.observer.disconnect()
    }

    private addCallback(
        type:
            | 'progress'
            | 'enter'
            | 'left'
            | IntersectIndividualCallbackTypes,
        callback: any
    ) {
        this.callbacks[type] = callback
    }

    private removeCallback(
        type:
            | 'progress'
            | 'enter'
            | 'left'
            | IntersectIndividualCallbackTypes
    ) {
        delete this.callbacks[type]
    }
}
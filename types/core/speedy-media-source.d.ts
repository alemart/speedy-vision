/**
 * An abstract media source: a wrapper around native
 * elements such as: HTMLImageElement, HTMLVideoElement,
 * and so on
 * @abstract
 */
export class SpeedyMediaSource {
    /**
     * Load a media source
     * @param {SpeedyMediaSourceNativeElement} wrappedObject
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    static load(wrappedObject: SpeedyMediaSourceNativeElement): SpeedyPromise<SpeedyMediaSource>;
    /**
     * Wait for an event to be triggered in an element
     * @param {Element} element
     * @param {string} eventName
     * @param {number} [timeout] in ms
     * @returns {SpeedyPromise<Element>}
     */
    static _waitUntil(element: Element, eventName: string, timeout?: number | undefined): SpeedyPromise<Element>;
    /**
     * @protected Constructor
     * @param {symbol} token
     */
    protected constructor();
    /** @type {SpeedyMediaSourceNativeElement} underlying media object */
    _data: SpeedyMediaSourceNativeElement;
    /**
     * The underlying wrapped object
     * @returns {SpeedyMediaSourceNativeElement}
     */
    get data(): SpeedyMediaSourceNativeElement;
    /**
     * Is the underlying media loaded?
     * @returns {boolean}
     */
    isLoaded(): boolean;
    /**
     * The type of the underlying media source
     * @abstract
     * @returns {MediaType}
     */
    get type(): Symbol;
    /**
     * Media width, in pixels
     * @abstract
     * @returns {number}
     */
    get width(): number;
    /**
     * Media height, in pixels
     * @abstract
     * @returns {number}
     */
    get height(): number;
    /**
     * Clone this media source
     * @abstract
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    clone(): SpeedyPromise<SpeedyMediaSource>;
    /**
     * Release resources associated with this object
     * @returns {null}
     */
    release(): null;
    /**
     * Load the underlying media
     * @abstract
     * @param {SpeedyMediaSourceNativeElement} element
     * @returns {SpeedyPromise<SpeedyMediaSource>}
     */
    _load(element: SpeedyMediaSourceNativeElement): SpeedyPromise<SpeedyMediaSource>;
}
export type SpeedyMediaSourceNativeElement = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | OffscreenCanvas | ImageBitmap | ImageData;
import { SpeedyPromise } from "./speedy-promise";

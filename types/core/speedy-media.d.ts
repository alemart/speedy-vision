/**
 * SpeedyMedia encapsulates a media element
 * (e.g., image, video, canvas)
 */
export class SpeedyMedia {
    /**
     * Load a media source
     * Will wait until the HTML media source is loaded
     * @param {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} mediaSource An image, video or canvas
     * @param {SpeedyMediaOptions} [options] options object
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(mediaSource: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap, options?: SpeedyMediaOptions): SpeedyPromise<SpeedyMedia>;
    /**
     * @private Constructor. It receives a VALID media source that is ALREADY LOADED.
     * @param {symbol} token
     * @param {SpeedyMediaSource} source
     * @param {SpeedyMediaOptions} [options] options object
     */
    private constructor();
    /** @type {SpeedyMediaSource} media source */
    _source: SpeedyMediaSource;
    /** @type {ImageFormat} format */
    _format: ImageFormat;
    /** @type {SpeedyMediaOptions} options */
    _options: SpeedyMediaOptions;
    /**
     * The media element (image, video, canvas) encapsulated by this SpeedyMedia object
     * @returns {HTMLImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap} the media element
     */
    get source(): HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap;
    /**
     * Gets the width of the media
     * @returns {number} media width
     */
    get width(): number;
    /**
     * Gets the height of the media
     * @returns {number} media height
     */
    get height(): number;
    /**
     * The type of the media attached to this SpeedyMedia object
     * @returns {string} "image" | "video" | "canvas" | "bitmap"
     */
    get type(): string;
    /**
     * Returns a read-only object featuring advanced options
     * related to this SpeedyMedia object
     * @returns {SpeedyMediaOptions}
     */
    get options(): SpeedyMediaOptions;
    /**
     * Releases resources associated with this media
     * @returns {null}
     */
    release(): null;
    /**
     * Has this media been released?
     * @returns {boolean}
     */
    isReleased(): boolean;
    /**
     * Clones the SpeedyMedia object
     * @returns {SpeedyPromise<SpeedyMedia>} a clone object
     */
    clone(): SpeedyPromise<SpeedyMedia>;
    /**
     * Draws the media to a canvas
     * @param {HTMLCanvasElement} canvas canvas element
     * @param {number} [x] x-position
     * @param {number} [y] y-position
     * @param {number} [width] desired width
     * @param {number} [height] desired height
     */
    draw(canvas: HTMLCanvasElement, x?: number, y?: number, width?: number, height?: number): void;
    /**
     * Converts the media to an ImageBitmap
     * @returns {SpeedyPromise<ImageBitmap>}
     */
    toBitmap(): SpeedyPromise<ImageBitmap>;
}
export type SpeedyMediaOptions = {
    /**
     * default is RGBA
     */
    format?: ImageFormat;
};
import { SpeedyMediaSource } from "./speedy-media-source";
import { ImageFormat } from "../utils/types";
import { SpeedyPromise } from "../utils/speedy-promise";

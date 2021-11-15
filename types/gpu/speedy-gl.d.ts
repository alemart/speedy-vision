/**
 * A wrapper around the WebGL Rendering Context
 */
export class SpeedyGL extends Observable {
    /**
     * Get Singleton
     * @returns {SpeedyGL}
     */
    static get instance(): SpeedyGL;
    /**
     * Constructor
     * @param {Symbol} key
     * @private
     */
    private constructor();
    /** @type {HTMLCanvasElement} canvas */
    _canvas: HTMLCanvasElement;
    /** @type {WebGL2RenderingContext} WebGL rendering context */
    _gl: WebGL2RenderingContext;
    /** @type {boolean} internal flag */
    _reinitializeOnContextLoss: boolean;
    /**
     * The WebGL Rendering Context
     * Be careful not to cache this, as the WebGL Rendering Context may be lost!
     * @returns {WebGL2RenderingContext}
     */
    get gl(): WebGL2RenderingContext;
    /**
     * The canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas(): HTMLCanvasElement;
    /**
     * Create a WebGL-capable canvas
     * @param {Function} reinitialize to be called if we get a WebGL context loss event
     * @returns {HTMLCanvasElement}
     */
    _createCanvas(reinitialize: Function): HTMLCanvasElement;
    /**
     * Create a WebGL2 Rendering Context
     * @param {HTMLCanvasElement} canvas
     * @returns {WebGL2RenderingContext}
     */
    _createContext(canvas: HTMLCanvasElement): WebGL2RenderingContext;
    /**
     * Reinitialize WebGL
     */
    _reinitialize(): void;
    /**
     * Lose the WebGL context. This is used to manually
     * free resources, and also for purposes of testing
     * @returns {WEBGL_lose_context}
     */
    loseContext(): WEBGL_lose_context;
    /**
     * Lose & restore the WebGL context
     * @param {number} [secondsToRestore]
     * @return {SpeedyPromise<WEBGL_lose_context>} resolves as soon as the context is restored
     */
    loseAndRestoreContext(secondsToRestore?: number): SpeedyPromise<WEBGL_lose_context>;
}
import { Observable } from "../utils/observable";
import { SpeedyPromise } from "../utils/speedy-promise";
//# sourceMappingURL=speedy-gl.d.ts.map
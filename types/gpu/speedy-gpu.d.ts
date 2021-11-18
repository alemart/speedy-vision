/**
 * GPU-accelerated routines for Computer Vision
 */
export class SpeedyGPU extends Observable {
    /** @type {SpeedyGL} cached reference */
    _speedyGL: SpeedyGL;
    /** @type {SpeedyProgramCenter} GPU-based programs */
    _programs: SpeedyProgramCenter;
    /** @type {SpeedyTexturePool} texture pool */
    _texturePool: SpeedyTexturePool;
    /** @type {SpeedyTextureUploader} texture uploader */
    _textureUploader: SpeedyTextureUploader;
    /**
     * Access point to all GPU programs
     * @returns {SpeedyProgramCenter}
     */
    get programs(): SpeedyProgramCenter;
    /**
     * The WebGL Rendering Context
     * Be careful not to cache this, as the WebGL Rendering Context may be lost!
     * @returns {WebGL2RenderingContext}
     */
    get gl(): WebGL2RenderingContext;
    /**
     * Internal canvas
     * @returns {HTMLCanvasElement}
     */
    get canvas(): HTMLCanvasElement;
    /**
     * Texture pool
     * @returns {SpeedyTexturePool}
     */
    get texturePool(): SpeedyTexturePool;
    /**
     * Renders a texture to the canvas
     * @param {SpeedyTexture} texture
     * @returns {HTMLCanvasElement} returned for convenience
     */
    renderToCanvas(texture: SpeedyTexture): HTMLCanvasElement;
    /**
     * Upload an image to the GPU
     * @param {SpeedyMediaSource} source
     * @param {SpeedyTexture} outputTexture
     * @returns {SpeedyTexture} outputTexture
     */
    upload(source: SpeedyMediaSource, outputTexture: SpeedyTexture): SpeedyTexture;
    /**
     * Releases resources
     * @returns {null}
     */
    release(): null;
    /**
     * Has this SpeedyGPU been released?
     * @returns {boolean}
     */
    isReleased(): boolean;
    /**
     * Lose & restore the WebGL context (useful for testing purposes)
     * @return {SpeedyPromise<void>} resolves as soon as the context is restored
     */
    loseAndRestoreWebGLContext(): SpeedyPromise<void>;
    /**
     * Reset the internal state
     * (called on context reset)
     */
    _reset(): void;
}
import { Observable } from "../utils/observable";
import { SpeedyGL } from "./speedy-gl";
import { SpeedyProgramCenter } from "./speedy-program-center";
import { SpeedyTexturePool } from "./speedy-texture-pool";
import { SpeedyTextureUploader } from "./speedy-texture-uploader";
import { SpeedyTexture } from "./speedy-texture";
import { SpeedyMediaSource } from "../core/speedy-media-source";
import { SpeedyPromise } from "../utils/speedy-promise";

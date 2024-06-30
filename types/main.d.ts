/**
 * GPU-accelerated Computer Vision for JavaScript
 */
export default class Speedy {
    /**
     * The version of the library
     * @returns {string}
     */
    static get version(): string;
    /**
     * Checks if Speedy can be executed in this machine & browser
     * @returns {boolean}
     */
    static isSupported(): boolean;
    /**
     * Global settings
     * @returns {typeof Settings}
     */
    static get Settings(): typeof Settings;
    /**
     * Create a 2D vector
     * @returns {SpeedyPipelineVector2Factory & ((x: number, y: number) => SpeedyVector2)}
     */
    static get Vector2(): SpeedyPipelineVector2Factory & ((x: number, y: number) => SpeedyVector2);
    /**
     * Create a 2D point
     * @param {number} x
     * @param {number} y
     * @returns {SpeedyPoint2}
     */
    static Point2(x: number, y: number): SpeedyPoint2;
    /**
     * Create a new size object
     * @param {number} width
     * @param {number} height
     * @returns {SpeedySize}
     */
    static Size(width: number, height: number): SpeedySize;
    /**
     * Create a Matrix (entries are given in column-major format)
     * @returns {SpeedyMatrixFactory & ((rows: number, columns: number, entries: number[]) => SpeedyMatrix) & ((expr: SpeedyMatrixExpr) => SpeedyMatrix)}
     */
    static get Matrix(): SpeedyMatrixFactory & ((rows: number, columns: number, entries: number[]) => SpeedyMatrix) & ((expr: SpeedyMatrixExpr) => SpeedyMatrix);
    /**
     * Speedy Promises
     * @returns {typeof SpeedyPromise}
     */
    static get Promise(): typeof SpeedyPromise;
    /**
     * Create a new Pipeline
     * @returns {SpeedyPipeline}
     */
    static Pipeline(): SpeedyPipeline;
    /**
     * Image-related nodes
     * @returns {typeof SpeedyPipelineImageFactory}
     */
    static get Image(): typeof SpeedyPipelineImageFactory;
    /**
     * Image filters
     * @returns {typeof SpeedyPipelineFilterFactory}
     */
    static get Filter(): typeof SpeedyPipelineFilterFactory;
    /**
     * Image transforms
     * @returns {typeof SpeedyPipelineTransformFactory}
     */
    static get Transform(): typeof SpeedyPipelineTransformFactory;
    /**
     * Keypoint-related nodes
     * @returns {typeof SpeedyPipelineKeypointFactory}
     */
    static get Keypoint(): typeof SpeedyPipelineKeypointFactory;
    /**
     * Loads a SpeedyMedia object based on the provided source element
     * @param {SpeedyMediaSourceNativeElement} sourceElement The source media
     * @param {SpeedyMediaOptions} [options] Additional options for advanced configuration
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(sourceElement: SpeedyMediaSourceNativeElement, options?: import("./core/speedy-media").SpeedyMediaOptions | undefined): SpeedyPromise<SpeedyMedia>;
    /**
     * Loads a camera stream
     * @param {number | MediaStreamConstraints} [widthOrConstraints] width of the stream or contraints object
     * @param {number} [height] height of the stream
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static camera(widthOrConstraints?: number | MediaStreamConstraints | undefined, height?: number | undefined): SpeedyPromise<SpeedyMedia>;
    /**
     * Utilities to query information about the graphics driver
     * @returns {typeof SpeedyPlatform}
     */
    static get Platform(): typeof SpeedyPlatform;
    /**
     * The FPS rate
     * @returns {number} Frames per second (FPS)
     */
    static get fps(): number;
}
export type SpeedyMatrix = import('./core/speedy-matrix').SpeedyMatrix;
export type SpeedyMatrixExpr = import('./core/speedy-matrix-expr').SpeedyMatrixExpr;
export type SpeedyMediaOptions = import('./core/speedy-media').SpeedyMediaOptions;
export type SpeedyMediaSourceNativeElement = import('./core/speedy-media-source').SpeedyMediaSourceNativeElement;
import { Settings } from "./core/settings";
import { SpeedyPipelineVector2Factory } from "./core/pipeline/factories/vector2-factory";
import { SpeedyVector2 } from "./core/speedy-vector";
import { SpeedyPoint2 } from "./core/speedy-point";
import { SpeedySize } from "./core/speedy-size";
import { SpeedyMatrixFactory } from "./core/speedy-matrix-factory";
import { SpeedyPromise } from "./core/speedy-promise";
import { SpeedyPipeline } from "./core/pipeline/pipeline";
import { SpeedyPipelineImageFactory } from "./core/pipeline/factories/image-factory";
import { SpeedyPipelineFilterFactory } from "./core/pipeline/factories/filter-factory";
import { SpeedyPipelineTransformFactory } from "./core/pipeline/factories/transform-factory";
import { SpeedyPipelineKeypointFactory } from "./core/pipeline/factories/keypoint-factory";
import { SpeedyMedia } from "./core/speedy-media";
import { SpeedyPlatform } from "./core/speedy-platform";

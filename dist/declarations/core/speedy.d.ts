/**
 * Speedy's main class
 */
export class Speedy {
    /**
     * Loads a SpeedyMedia object based on the provided source element
     * @param {SpeedyMediaSourceNativeElement} sourceElement The source media
     * @param {SpeedyMediaOptions} [options] Additional options for advanced configuration
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static load(sourceElement: SpeedyMediaSourceNativeElement, options?: SpeedyMediaOptions): SpeedyPromise<SpeedyMedia>;
    /**
     * Loads a camera stream
     * @param {number | MediaStreamConstraints} [widthOrConstraints] width of the stream or contraints object
     * @param {number} [height] height of the stream
     * @returns {SpeedyPromise<SpeedyMedia>}
     */
    static camera(widthOrConstraints?: number | MediaStreamConstraints, height?: number): SpeedyPromise<SpeedyMedia>;
    /**
     * The version of the library
     * @returns {string} The version of the library
     */
    static get version(): string;
    /**
     * The FPS rate
     * @returns {number} Frames per second (FPS)
     */
    static get fps(): number;
    /**
     * 2D vector instantiation and related nodes
     * @returns {SpeedyPipelineVector2Factory}
     */
    static get Vector2(): SpeedyPipelineVector2Factory;
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
     * Matrix routines
     * @returns {SpeedyMatrixFactory}
     */
    static get Matrix(): SpeedyMatrixFactory;
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
}
export type SpeedyMediaOptions = import('./speedy-media').SpeedyMediaOptions;
export type SpeedyMediaSourceNativeElement = import('./speedy-media-source').SpeedyMediaSourceNativeElement;
import { SpeedyPromise } from "../utils/speedy-promise";
import { SpeedyMedia } from "./speedy-media";
import { SpeedyPipelineVector2Factory } from "./pipeline/factories/vector2-factory";
import { SpeedyPoint2 } from "./speedy-point";
import { SpeedySize } from "./speedy-size";
import { SpeedyMatrixFactory } from "./speedy-matrix-factory";
import { SpeedyPipeline } from "./pipeline/pipeline";
import { SpeedyPipelineImageFactory } from "./pipeline/factories/image-factory";
import { SpeedyPipelineFilterFactory } from "./pipeline/factories/filter-factory";
import { SpeedyPipelineTransformFactory } from "./pipeline/factories/transform-factory";
import { SpeedyPipelineKeypointFactory } from "./pipeline/factories/keypoint-factory";
//# sourceMappingURL=speedy.d.ts.map
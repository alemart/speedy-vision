/**
 * Portal nodes
 */
export class SpeedyPipelineImagePortalFactory extends SpeedyNamespace {
    /**
     * Create an image portal source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePortalSource}
     */
    static Source(name?: string): SpeedyPipelineNodeImagePortalSource;
    /**
     * Create an image portal sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePortalSink}
     */
    static Sink(name?: string): SpeedyPipelineNodeImagePortalSink;
}
/**
 * Image nodes
 */
export class SpeedyPipelineImageFactory extends SpeedyNamespace {
    /**
     * Create an image source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSource}
     */
    static Source(name?: string): SpeedyPipelineNodeImageSource;
    /**
     * Create an image sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageSink}
     */
    static Sink(name?: string): SpeedyPipelineNodeImageSink;
    /**
     * Create an image multiplexer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMultiplexer}
     */
    static Multiplexer(name?: string): SpeedyPipelineNodeImageMultiplexer;
    /**
     * Create an image buffer
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageBuffer}
     */
    static Buffer(name?: string): SpeedyPipelineNodeImageBuffer;
    /**
     * Image Pyramid
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImagePyramid}
     */
    static Pyramid(name?: string): SpeedyPipelineNodeImagePyramid;
    /**
     * Image Mixer (blending)
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeImageMixer}
     */
    static Mixer(name?: string): SpeedyPipelineNodeImageMixer;
    /**
     * Image Portals
     * @returns {typeof SpeedyPipelineImagePortalFactory}
     */
    static get Portal(): typeof SpeedyPipelineImagePortalFactory;
}
import { SpeedyNamespace } from "../../speedy-namespace";
import { SpeedyPipelineNodeImagePortalSource } from "../nodes/images/portal";
import { SpeedyPipelineNodeImagePortalSink } from "../nodes/images/portal";
import { SpeedyPipelineNodeImageSource } from "../nodes/images/source";
import { SpeedyPipelineNodeImageSink } from "../nodes/images/sink";
import { SpeedyPipelineNodeImageMultiplexer } from "../nodes/images/multiplexer";
import { SpeedyPipelineNodeImageBuffer } from "../nodes/images/buffer";
import { SpeedyPipelineNodeImagePyramid } from "../nodes/images/pyramid";
import { SpeedyPipelineNodeImageMixer } from "../nodes/images/mixer";
//# sourceMappingURL=image-factory.d.ts.map
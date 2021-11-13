/**
 * Portal nodes
 */
export class SpeedyPipelineKeypointPortalFactory extends SpeedyNamespace {
    /**
     * Create an image portal source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointPortalSource}
     */
    static Source(name?: string): SpeedyPipelineNodeKeypointPortalSource;
    /**
     * Create an image portal sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointPortalSink}
     */
    static Sink(name?: string): SpeedyPipelineNodeKeypointPortalSink;
}
/**
 * Keypoint-related nodes
 */
export class SpeedyPipelineKeypointFactory extends SpeedyNamespace {
    /**
     * Keypoint detectors
     * @returns {typeof SpeedyPipelineKeypointDetectorFactory}
     */
    static get Detector(): typeof SpeedyPipelineKeypointDetectorFactory;
    /**
     * Keypoint descriptors
     * @returns {typeof SpeedyPipelineKeypointDescriptorFactory}
     */
    static get Descriptor(): typeof SpeedyPipelineKeypointDescriptorFactory;
    /**
     * Keypoint trackers
     * @returns {typeof SpeedyPipelineKeypointTrackerFactory}
     */
    static get Tracker(): typeof SpeedyPipelineKeypointTrackerFactory;
    /**
     * Keypoint Portals
     * @returns {typeof SpeedyPipelineKeypointPortalFactory}
     */
    static get Portal(): typeof SpeedyPipelineKeypointPortalFactory;
    /**
     * Create a keypoint source
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSource}
     */
    static Source(name?: string): SpeedyPipelineNodeKeypointSource;
    /**
     * Create a keypoint sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSink}
     */
    static Sink(name?: string): SpeedyPipelineNodeKeypointSink;
    /**
     * Keypoint clipper
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointClipper}
     */
    static Clipper(name?: string): SpeedyPipelineNodeKeypointClipper;
    /**
     * Create a keypoint buffer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointBuffer}
     */
    static Buffer(name?: string): SpeedyPipelineNodeKeypointBuffer;
    /**
     * Create a keypoint mixer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMixer}
     */
    static Mixer(name?: string): SpeedyPipelineNodeKeypointMixer;
    /**
     * Create a keypoint multiplexer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMultiplexer}
     */
    static Multiplexer(name?: string): SpeedyPipelineNodeKeypointMultiplexer;
    /**
     * Create a keypoint transformer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointTransformer}
     */
    static Transformer(name?: string): SpeedyPipelineNodeKeypointTransformer;
    /**
     * Create a subpixel refiner of keypoint locations
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSubpixelRefiner}
     */
    static SubpixelRefiner(name?: string): SpeedyPipelineNodeKeypointSubpixelRefiner;
}
import { SpeedyNamespace } from "../../speedy-namespace";
import { SpeedyPipelineNodeKeypointPortalSource } from "../nodes/keypoints/portal";
import { SpeedyPipelineNodeKeypointPortalSink } from "../nodes/keypoints/portal";
/**
 * Keypoint detectors
 */
declare class SpeedyPipelineKeypointDetectorFactory extends SpeedyNamespace {
    /**
     * FAST corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeFASTKeypointDetector}
     */
    static FAST(name?: string): SpeedyPipelineNodeFASTKeypointDetector;
    /**
     * Harris corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeHarrisKeypointDetector}
     */
    static Harris(name?: string): SpeedyPipelineNodeHarrisKeypointDetector;
}
/**
 * Keypoint descriptors
 */
declare class SpeedyPipelineKeypointDescriptorFactory extends SpeedyNamespace {
    /**
     * ORB descriptors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeORBKeypointDescriptor}
     */
    static ORB(name?: string): SpeedyPipelineNodeORBKeypointDescriptor;
    /**
     * Discard descriptors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeDiscardKeypointDescriptor}
     */
    static Discard(name?: string): SpeedyPipelineNodeDiscardKeypointDescriptor;
}
/**
 * Keypoint trackers
 */
declare class SpeedyPipelineKeypointTrackerFactory extends SpeedyNamespace {
    /**
     * LK optical-flow
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeLKKeypointTracker}
     */
    static LK(name?: string): SpeedyPipelineNodeLKKeypointTracker;
}
import { SpeedyPipelineNodeKeypointSource } from "../nodes/keypoints/source";
import { SpeedyPipelineNodeKeypointSink } from "../nodes/keypoints/sink";
import { SpeedyPipelineNodeKeypointClipper } from "../nodes/keypoints/clipper";
import { SpeedyPipelineNodeKeypointBuffer } from "../nodes/keypoints/buffer";
import { SpeedyPipelineNodeKeypointMixer } from "../nodes/keypoints/mixer";
import { SpeedyPipelineNodeKeypointMultiplexer } from "../nodes/keypoints/multiplexer";
import { SpeedyPipelineNodeKeypointTransformer } from "../nodes/keypoints/transformer";
import { SpeedyPipelineNodeKeypointSubpixelRefiner } from "../nodes/keypoints/subpixel";
import { SpeedyPipelineNodeFASTKeypointDetector } from "../nodes/keypoints/detectors/fast";
import { SpeedyPipelineNodeHarrisKeypointDetector } from "../nodes/keypoints/detectors/harris";
import { SpeedyPipelineNodeORBKeypointDescriptor } from "../nodes/keypoints/descriptors/orb";
import { SpeedyPipelineNodeDiscardKeypointDescriptor } from "../nodes/keypoints/descriptors/discard";
import { SpeedyPipelineNodeLKKeypointTracker } from "../nodes/keypoints/trackers/lk";
export {};
//# sourceMappingURL=keypoint-factory.d.ts.map
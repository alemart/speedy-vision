/**
 * Portal nodes
 */
export class SpeedyPipelineKeypointPortalFactory extends SpeedyNamespace {
    /**
     * Create an image portal source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointPortalSource}
     */
    static Source(name?: string | undefined): SpeedyPipelineNodeKeypointPortalSource;
    /**
     * Create an image portal sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointPortalSink}
     */
    static Sink(name?: string | undefined): SpeedyPipelineNodeKeypointPortalSink;
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
     * Keypoint matchers
     * @returns {typeof SpeedyPipelineKeypointMatcherFactory}
     */
    static get Matcher(): typeof SpeedyPipelineKeypointMatcherFactory;
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
    static Source(name?: string | undefined): SpeedyPipelineNodeKeypointSource;
    /**
     * Create a keypoint sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSink}
     */
    static Sink(name?: string | undefined): SpeedyPipelineNodeKeypointSink;
    /**
     * Create a sink of tracked keypoints
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeTrackedKeypointSink}
     */
    static SinkOfTrackedKeypoints(name?: string | undefined): SpeedyPipelineNodeTrackedKeypointSink;
    /**
     * Create a sink of matched keypoints
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeMatchedKeypointSink}
     */
    static SinkOfMatchedKeypoints(name?: string | undefined): SpeedyPipelineNodeMatchedKeypointSink;
    /**
     * Keypoint clipper
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointClipper}
     */
    static Clipper(name?: string | undefined): SpeedyPipelineNodeKeypointClipper;
    /**
     * Border Clipper
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointBorderClipper}
     */
    static BorderClipper(name?: string | undefined): SpeedyPipelineNodeKeypointBorderClipper;
    /**
     * Create a keypoint buffer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointBuffer}
     */
    static Buffer(name?: string | undefined): SpeedyPipelineNodeKeypointBuffer;
    /**
     * Create a keypoint mixer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMixer}
     */
    static Mixer(name?: string | undefined): SpeedyPipelineNodeKeypointMixer;
    /**
     * Create a keypoint shuffler
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointShuffler}
     */
    static Shuffler(name?: string | undefined): SpeedyPipelineNodeKeypointShuffler;
    /**
     * Create a keypoint multiplexer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMultiplexer}
     */
    static Multiplexer(name?: string | undefined): SpeedyPipelineNodeKeypointMultiplexer;
    /**
     * Create a keypoint transformer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointTransformer}
     */
    static Transformer(name?: string | undefined): SpeedyPipelineNodeKeypointTransformer;
    /**
     * Create a subpixel refiner of keypoint locations
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSubpixelRefiner}
     */
    static SubpixelRefiner(name?: string | undefined): SpeedyPipelineNodeKeypointSubpixelRefiner;
    /**
     * Distance filter
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeDistanceFilter}
     */
    static DistanceFilter(name?: string | undefined): any;
    /**
     * Hamming distance filter
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeHammingDistanceFilter}
     */
    static HammingDistanceFilter(name?: string | undefined): any;
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
    static FAST(name?: string | undefined): SpeedyPipelineNodeFASTKeypointDetector;
    /**
     * Harris corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeHarrisKeypointDetector}
     */
    static Harris(name?: string | undefined): SpeedyPipelineNodeHarrisKeypointDetector;
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
    static ORB(name?: string | undefined): SpeedyPipelineNodeORBKeypointDescriptor;
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
    static LK(name?: string | undefined): SpeedyPipelineNodeLKKeypointTracker;
}
/**
 * Keypoint matchers
 */
declare class SpeedyPipelineKeypointMatcherFactory extends SpeedyNamespace {
    /**
     * Static LSH tables
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeStaticLSHTables}
     */
    static StaticLSHTables(name?: string | undefined): SpeedyPipelineNodeStaticLSHTables;
    /**
     * LSH-based K-approximate nearest neighbors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeLSHKNNMatcher}
     */
    static LSHKNN(name?: string | undefined): SpeedyPipelineNodeLSHKNNMatcher;
    /**
     * Brute-force K-nearest neighbors keypoint matcher
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeBruteForceKNNKeypointMatcher}
     */
    static BFKNN(name?: string | undefined): SpeedyPipelineNodeBruteForceKNNKeypointMatcher;
}
import { SpeedyPipelineNodeKeypointSource } from "../nodes/keypoints/source";
import { SpeedyPipelineNodeKeypointSink } from "../nodes/keypoints/sink";
import { SpeedyPipelineNodeTrackedKeypointSink } from "../nodes/keypoints/sink";
import { SpeedyPipelineNodeMatchedKeypointSink } from "../nodes/keypoints/sink";
import { SpeedyPipelineNodeKeypointClipper } from "../nodes/keypoints/clipper";
import { SpeedyPipelineNodeKeypointBorderClipper } from "../nodes/keypoints/border-clipper";
import { SpeedyPipelineNodeKeypointBuffer } from "../nodes/keypoints/buffer";
import { SpeedyPipelineNodeKeypointMixer } from "../nodes/keypoints/mixer";
import { SpeedyPipelineNodeKeypointShuffler } from "../nodes/keypoints/shuffler";
import { SpeedyPipelineNodeKeypointMultiplexer } from "../nodes/keypoints/multiplexer";
import { SpeedyPipelineNodeKeypointTransformer } from "../nodes/keypoints/transformer";
import { SpeedyPipelineNodeKeypointSubpixelRefiner } from "../nodes/keypoints/subpixel";
import { SpeedyPipelineNodeFASTKeypointDetector } from "../nodes/keypoints/detectors/fast";
import { SpeedyPipelineNodeHarrisKeypointDetector } from "../nodes/keypoints/detectors/harris";
import { SpeedyPipelineNodeORBKeypointDescriptor } from "../nodes/keypoints/descriptors/orb";
import { SpeedyPipelineNodeLKKeypointTracker } from "../nodes/keypoints/trackers/lk";
import { SpeedyPipelineNodeStaticLSHTables } from "../nodes/keypoints/matchers/lsh-static-tables";
import { SpeedyPipelineNodeLSHKNNMatcher } from "../nodes/keypoints/matchers/lsh-knn";
import { SpeedyPipelineNodeBruteForceKNNKeypointMatcher } from "../nodes/keypoints/matchers/bf-knn";
export {};

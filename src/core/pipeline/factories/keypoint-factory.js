/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2020-2023 Alexandre Martins <alemartf(at)gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * keypoint-factory.js
 * Keypoint-related nodes
 */

import { SpeedyNamespace } from '../../speedy-namespace';
import { SpeedyPipelineNodeKeypointSource } from '../nodes/keypoints/source';
import { SpeedyPipelineNodeKeypointSink, SpeedyPipelineNodeTrackedKeypointSink, SpeedyPipelineNodeMatchedKeypointSink } from '../nodes/keypoints/sink';
import { SpeedyPipelineNodeKeypointClipper } from '../nodes/keypoints/clipper';
import { SpeedyPipelineNodeKeypointBorderClipper } from '../nodes/keypoints/border-clipper';
import { SpeedyPipelineNodeKeypointBuffer } from '../nodes/keypoints/buffer';
import { SpeedyPipelineNodeKeypointMixer } from '../nodes/keypoints/mixer';
import { SpeedyPipelineNodeKeypointShuffler } from '../nodes/keypoints/shuffler';
import { SpeedyPipelineNodeKeypointMultiplexer } from '../nodes/keypoints/multiplexer';
import { SpeedyPipelineNodeKeypointTransformer } from '../nodes/keypoints/transformer';
import { SpeedyPipelineNodeKeypointSubpixelRefiner } from '../nodes/keypoints/subpixel';
import { SpeedyPipelineNodeFASTKeypointDetector } from '../nodes/keypoints/detectors/fast';
import { SpeedyPipelineNodeHarrisKeypointDetector } from '../nodes/keypoints/detectors/harris';
import { SpeedyPipelineNodeORBKeypointDescriptor } from '../nodes/keypoints/descriptors/orb';
import { SpeedyPipelineNodeLKKeypointTracker } from '../nodes/keypoints/trackers/lk';
import { SpeedyPipelineNodeStaticLSHTables } from '../nodes/keypoints/matchers/lsh-static-tables';
import { SpeedyPipelineNodeLSHKNNKeypointMatcher } from '../nodes/keypoints/matchers/lsh-knn';
import { SpeedyPipelineNodeBruteForceKNNKeypointMatcher } from '../nodes/keypoints/matchers/bf-knn';
import { SpeedyPipelineNodeKeypointDistanceFilter } from '../nodes/keypoints/distance-filter';
import { SpeedyPipelineNodeKeypointHammingDistanceFilter } from '../nodes/keypoints/hamming-distance-filter';
import { SpeedyPipelineNodeKeypointPortalSource, SpeedyPipelineNodeKeypointPortalSink } from '../nodes/keypoints/portal';

/**
 * Keypoint detectors
 */
class SpeedyPipelineKeypointDetectorFactory extends SpeedyNamespace
{
    /**
     * FAST corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeFASTKeypointDetector}
     */
    static FAST(name = undefined)
    {
        return new SpeedyPipelineNodeFASTKeypointDetector(name);
    }

    /**
     * Harris corner detector
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeHarrisKeypointDetector}
     */
    static Harris(name = undefined)
    {
        return new SpeedyPipelineNodeHarrisKeypointDetector(name);
    }
}

/**
 * Keypoint descriptors
 */
class SpeedyPipelineKeypointDescriptorFactory extends SpeedyNamespace
{
    /**
     * ORB descriptors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeORBKeypointDescriptor}
     */
    static ORB(name = undefined)
    {
        return new SpeedyPipelineNodeORBKeypointDescriptor(name);
    }
}

/**
 * Keypoint trackers
 */
class SpeedyPipelineKeypointTrackerFactory extends SpeedyNamespace
{
    /**
     * LK optical-flow
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeLKKeypointTracker}
     */
    static LK(name = undefined)
    {
        return new SpeedyPipelineNodeLKKeypointTracker(name);
    }
}

/**
 * Keypoint matchers
 */
class SpeedyPipelineKeypointMatcherFactory extends SpeedyNamespace
{
    /**
     * Static LSH tables
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeStaticLSHTables}
     */
    static StaticLSHTables(name = undefined)
    {
        return new SpeedyPipelineNodeStaticLSHTables(name);
    }

    /**
     * LSH-based K-approximate nearest neighbors
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeLSHKNNKeypointMatcher}
     */
    static LSHKNN(name = undefined)
    {
        return new SpeedyPipelineNodeLSHKNNKeypointMatcher(name);
    }

    /**
     * Brute-force K-nearest neighbors keypoint matcher
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeBruteForceKNNKeypointMatcher}
     */
    static BFKNN(name = undefined)
    {
        return new SpeedyPipelineNodeBruteForceKNNKeypointMatcher(name);
    }
}

/**
 * Portal nodes
 */
export class SpeedyPipelineKeypointPortalFactory extends SpeedyNamespace
{
    /**
     * Create an image portal source
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointPortalSource}
     */
    static Source(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointPortalSource(name);
    }

    /**
     * Create an image portal sink
     * @param {string} [name] name of the node
     * @returns {SpeedyPipelineNodeKeypointPortalSink}
     */
    static Sink(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointPortalSink(name);
    }
}

/**
 * Keypoint-related nodes
 */
export class SpeedyPipelineKeypointFactory extends SpeedyNamespace
{
    /**
     * Keypoint detectors
     * @returns {typeof SpeedyPipelineKeypointDetectorFactory}
     */
    static get Detector()
    {
        return SpeedyPipelineKeypointDetectorFactory;
    }

    /**
     * Keypoint descriptors
     * @returns {typeof SpeedyPipelineKeypointDescriptorFactory}
     */
    static get Descriptor()
    {
        return SpeedyPipelineKeypointDescriptorFactory;
    }

    /**
     * Keypoint trackers
     * @returns {typeof SpeedyPipelineKeypointTrackerFactory}
     */
    static get Tracker()
    {
        return SpeedyPipelineKeypointTrackerFactory;
    }

    /**
     * Keypoint matchers
     * @returns {typeof SpeedyPipelineKeypointMatcherFactory}
     */
    static get Matcher()
    {
        return SpeedyPipelineKeypointMatcherFactory;
    }

    /**
     * Keypoint Portals
     * @returns {typeof SpeedyPipelineKeypointPortalFactory}
     */
    static get Portal()
    {
        return SpeedyPipelineKeypointPortalFactory;
    }

    /**
     * Create a keypoint source
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSource}
     */
    static Source(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointSource(name);
    }

    /**
     * Create a keypoint sink
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSink}
     */
    static Sink(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointSink(name);
    }

    /**
     * Create a sink of tracked keypoints
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeTrackedKeypointSink}
     */
    static SinkOfTrackedKeypoints(name = undefined)
    {
        return new SpeedyPipelineNodeTrackedKeypointSink(name);
    }

    /**
     * Create a sink of matched keypoints
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeMatchedKeypointSink}
     */
    static SinkOfMatchedKeypoints(name = undefined)
    {
        return new SpeedyPipelineNodeMatchedKeypointSink(name);
    }

    /**
     * Keypoint clipper
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointClipper}
     */
    static Clipper(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointClipper(name);
    }

    /**
     * Border Clipper
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointBorderClipper}
     */
    static BorderClipper(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointBorderClipper(name);
    }

    /**
     * Create a keypoint buffer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointBuffer}
     */
    static Buffer(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointBuffer(name);
    }

    /**
     * Create a keypoint mixer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMixer}
     */
    static Mixer(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointMixer(name);
    }

    /**
     * Create a keypoint shuffler
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointShuffler}
     */
    static Shuffler(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointShuffler(name);
    }

    /**
     * Create a keypoint multiplexer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointMultiplexer}
     */
    static Multiplexer(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointMultiplexer(name);
    }

    /**
     * Create a keypoint transformer
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointTransformer}
     */
    static Transformer(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointTransformer(name);
    }

    /**
     * Create a subpixel refiner of keypoint locations
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSubpixelRefiner}
     */
    static SubpixelRefiner(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointSubpixelRefiner(name);
    }

    /**
     * Distance filter
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeDistanceFilter}
     */
    static DistanceFilter(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointDistanceFilter(name);
    }

    /**
     * Hamming distance filter
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeHammingDistanceFilter}
     */
    static HammingDistanceFilter(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointHammingDistanceFilter(name);
    }
}

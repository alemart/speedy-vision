/*
 * speedy-vision.js
 * GPU-accelerated Computer Vision for JavaScript
 * Copyright 2021 Alexandre Martins <alemartf(at)gmail.com>
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
import { SpeedyPipelineNodeKeypointSink } from '../nodes/keypoints/sink';
import { SpeedyPipelineNodeKeypointClipper } from '../nodes/keypoints/clipper';
import { SpeedyPipelineNodeFASTKeypointDetector } from '../nodes/keypoints/detectors/fast';
import { SpeedyPipelineNodeHarrisKeypointDetector } from '../nodes/keypoints/detectors/harris';
import { SpeedyPipelineNodeORBKeypointDescriptor } from '../nodes/keypoints/descriptors/orb';

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
     * @returns {SpeedyPipelineNodeFASTKeypointDetector}
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
 * Keypoint-related nodes
 */
export class SpeedyPipelineKeypointFactory extends SpeedyNamespace
{
    /**
     * Keypoint detectors
     * @returns {Function}
     */
    static get Detector()
    {
        return SpeedyPipelineKeypointDetectorFactory;
    }

    /**
     * Keypoint descriptors
     * @returns {Function}
     */
    static get Descriptor()
    {
        return SpeedyPipelineKeypointDescriptorFactory;
    }

    /**
     * Create a sink of keypoints
     * @param {string} [name]
     * @returns {SpeedyPipelineNodeKeypointSink}
     */
    static Sink(name = undefined)
    {
        return new SpeedyPipelineNodeKeypointSink(name);
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
}